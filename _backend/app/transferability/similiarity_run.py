import os.path
import json
from filelock import FileLock
from pymongo import MongoClient

from app.transferability.similiarity_logic import check_level, check_ects
from app.transferability.similiarity_logic import check_content
from app.transferability.similiarity_logic import compare_titles
from app.config.config_utils import env_config
from app.owl.modules import add_modules_to_owl
from app.api.module.model import ModuleResponseModel, UploadModulesResponseItemModel
from app.config.azure_blob import check_etag, get_etag, read_res_file, write_res_file

# TODO check if id already exists in similarity file


# get all modules from a specific uni
def get_all_module_data(uni):
    # get all data and prepare for run
    conn = MongoClient(env_config.DB_CONNECTION_STRING)
    # print(conn)
    db = conn[env_config.DB_NAME]
    data = db.get_collection("modules").find({"university": uni})
    return list(data)


# retrive all id's from the database of all modules
def get_all_module_id():
    # get all data and prepare for run
    conn = MongoClient(env_config.DB_CONNECTION_STRING)
    # print(conn)
    db = conn[env_config.DB_NAME]
    data = db.get_collection("modules").find({}, {"_id": 1})
    res = []
    for item in list(data):
        res.append(str(item["_id"]))
    return res


# fix results file after addition
def fix_res_file():
    data,etag = read_res_file()
    ids = get_all_module_id()
    to_remove_key = []
    # print(data)
    for key, item in data.items():
        to_remove_item = []
        if key not in ids:
            to_remove_key.append(key)
            continue

        index = 0
        while index < len(data[key]):
            if data[key][index] not in ids:
                to_remove_item.append(index)
            index += 1

        for i in sorted(to_remove_item, reverse=True):
            del data[key][i]

    for _id in to_remove_key:
        del data[_id]

    if check_etag(etag, get_etag("result.json")):
        write_res_file(data)
        add_modules_to_owl()
        return
    else:
        fix_res_file()

        


# get all modules from a different uni
def get_specific_module_data(uni):
    # get all data and prepare for run
    conn = MongoClient(env_config.DB_CONNECTION_STRING)
    # print(conn)
    db = conn[env_config.DB_NAME]
    data = db.get_collection("modules").find({"university": {"$ne": uni}})
    return list(data)


# Initial Run To Calculate Similarities Between All Modules
# Only to be run manually ~ takes 8 hours
def start_similarity_all():
    UNG = get_all_module_data("University of Nova Gorica")
    TUC = get_all_module_data("Technische Universitat Chemnitz")
    BUT = get_all_module_data("Bialystok University Of Technology")
    # Add Universities Here
    #
    #
    #

    similarity_results = dict()

    status = 1
    # comparisons_count = (len(BUT) * len(TUC)) + (len(BUT) * len(UNG))
    for mod in BUT:
        similarity_results[str(mod.get("_id"))] = []
        for comp_mod in TUC:
            # print(str(status), "/", str(comparisons_count))
            if check_similarity_db(mod, comp_mod):
                similarity_results[str(mod.get("_id"))].append(str(comp_mod.get("_id")))
            status = status + 1
        for comp_mod1 in UNG:
            # print(str(status), "/", str(comparisons_count))
            if check_similarity_db(mod, comp_mod1):
                similarity_results[str(mod.get("_id"))].append(str(comp_mod1.get("_id")))
            status = status + 1

    status = 1
    # comparisons_count = (len(TUC) * len(BUT)) + (len(TUC) * len(UNG))
    for mod in TUC:
        similarity_results[str(mod.get("_id"))] = []
        for comp_mod in BUT:
            # print(str(status), "/", str(comparisons_count))
            if check_similarity_db(mod, comp_mod):
                similarity_results[str(mod.get("_id"))].append(str(comp_mod.get("_id")))
            i = i + 1

        for comp_mod1 in UNG:
            # print(str(status), "/", str(comparisons_count))
            if check_similarity_db(mod, comp_mod1):
                similarity_results[str(mod.get("_id"))].append(str(comp_mod1.get("_id")))
            i = i + 1

    status = 1
    # comparisons_count = (len(BUT) * len(TUC)) + (len(BUT) * len(UNG))
    for mod in BUT:
        similarity_results[str(mod.get("_id"))] = []
        for comp_mod in TUC:
            # print(str(i), "/", str(comparisons_count))
            if check_similarity_db(mod, comp_mod):
                similarity_results[str(mod.get("_id"))].append(str(comp_mod.get("_id")))
            i = i + 1
        for comp_mod1 in UNG:
            # print(str(i), "/", str(comparisons_count))
            if check_similarity_db(mod, comp_mod1):
                similarity_results[str(mod.get("_id"))].append(str(comp_mod1.get("_id")))
            i = i + 1

    # write results to json file
    with open("result.json", "w") as outfile:
        json.dump(similarity_results, outfile)

    # insert to ontology
    add_modules_to_owl()


def start_similarity_for_one(inserted_mod: UploadModulesResponseItemModel):
    # calculate transferability between modules
    data = get_specific_module_data(inserted_mod.university)

    similarity_results,etag = read_res_file()
    similarity_changes = {}

    for modu in data:
        # A to B
        if check_similarity_class(inserted_mod, modu):
            if inserted_mod.module_id in similarity_results.keys() and str(modu["_id"]) not in similarity_results[inserted_mod.module_id]:
                # print("true")
                similarity_results[inserted_mod.module_id].append(str(modu["_id"]))
                if not (inserted_mod.module_id in similarity_changes):
                    similarity_changes[inserted_mod.module_id] = []
                if str(modu["_id"]) not in similarity_changes[inserted_mod.module_id]:
                    similarity_changes[inserted_mod.module_id].append(str(modu["_id"]))

        # B to A
        if check_similarity_class(modu, inserted_mod):
            if str(modu["_id"]) in similarity_results.keys() and inserted_mod.module_id not in similarity_results[str(modu["_id"])]:
                # print("true")
                similarity_results[str(modu["_id"])].append(inserted_mod.module_id)
                if not (str(modu["_id"]) in similarity_changes):
                    similarity_changes[str(modu["_id"])] = []
                if inserted_mod.module_id not in similarity_changes[str(modu["_id"])]:
                    similarity_changes[str(modu["_id"])].append(inserted_mod.module_id)
    return similarity_changes


def start_similarity_for_one_after_update(updated_mod: ModuleResponseModel):
    # calculate transferability between modules
    data = get_specific_module_data(updated_mod['university'])

    similarity_results,etag = read_res_file()
    similarity_changes = {}

    for modu in data:
        # A to B
        if check_similarity_class(updated_mod, modu):
            if updated_mod['id'] in similarity_results.keys() and str(modu["_id"]) not in similarity_results[updated_mod['id']]:
                # print("true")
                similarity_results[updated_mod['id']].append(str(modu["_id"]))
                if not (updated_mod['id'] in similarity_changes):
                    similarity_changes[updated_mod['id']] = []
                if str(modu["_id"]) not in similarity_changes[updated_mod['id']]:
                    similarity_changes[updated_mod['id']].append(str(modu["_id"]))

        # B to A
        if check_similarity_class(modu, updated_mod):
            if str(modu["_id"]) in similarity_results.keys() and updated_mod['id'] not in similarity_results[str(modu["_id"])]:
                # print("true")
                similarity_results[str(modu["_id"])].append(updated_mod['id'])
                if not (str(modu["_id"]) in similarity_changes):
                    similarity_changes[str(modu["_id"])] = []
                if updated_mod['id'] not in similarity_changes[str(modu["_id"])]:
                    similarity_changes[str(modu["_id"])].append(updated_mod['id'])

    return similarity_changes

def combine_similarity_results_and_write_back(similarity_changes: list):

    similarity_source,etag = read_res_file()
    res = fix_similarity_changes(similarity_changes)
    for key, value in res.items():
        similarity_source[key].extend(value)
    write_res_file(similarity_source)
    add_modules_to_owl()

# run a similarity check from the database
def check_similarity_db(module_a, module_b):
    degree_level = check_level(module_a.get("degree_level"), module_b.get("level"))
    content = check_content(module_a.get("content"), module_b.get("content"))
    module_name = compare_titles(module_a.get("name"), module_b.get("name"))
    ects = check_ects(module_a.get("ects"), module_b.get("ects"))

    # content is not at all similar and ects don't match and level does not match
    if content < -0.19 or not ects or not degree_level:
        return False
    # very similar content
    if degree_level and ects and content > 0.4:
        return True
    # name matches good and some similar contentcd
    if degree_level and ects and module_name > 0.7 and content > 0.19:
        return True
    # good ratio between name and content
    if degree_level and ects and module_name > 0.4 and content > 0.4:
        return True
    return False


def get_attribute(module, attribute_name: str):
    if type(module) == UploadModulesResponseItemModel:
        if not (attribute_name == "module_name" or attribute_name == "name"):
            return getattr(module, attribute_name)
        else:
            try:
                return getattr(module, "module_name")
            except:
                return getattr(module, "name")
    else:
        return module[attribute_name]

# check similarity by the model class
def check_similarity_class(module_a, module_b):
    degree_level = check_level(get_attribute(module_a, "degree_level"),
                               get_attribute(module_b, "degree_level"))
    content = check_content(get_attribute(module_a, "content"),
                            get_attribute(module_b, "content"))
    module_name = compare_titles(get_attribute(module_a, "name"),
                                 get_attribute(module_b, "name"))
    ects = check_ects(get_attribute(module_a, "ects"),
                      get_attribute(module_b, "ects"))

    # content is not at all similar and ects don't match and level does not match
    if content < -0.19 or not ects or not degree_level:
        return False
    # very similar content
    if degree_level and ects and content > 0.4:
        return True
    # name matches good and some similar contentcd
    if degree_level and ects and module_name > 0.7 and content > 0.19:
        return True
    # good ratio between name and content
    if degree_level and ects and module_name > 0.4 and content > 0.4:
        return True
    return False


# takes 2 module id numbers and removes the similarity from first to second
def remove_similarity(module_to_remove_from: str, module_to_remove: str):
    data,etag = read_res_file()

    index = -1

    if module_to_remove_from not in data.keys() or module_to_remove not in data.keys():
        raise Exception("Module Not Found!")

    i = 0
    while i < len(data[module_to_remove_from]):
        if (data[module_to_remove_from][i] == module_to_remove):
            index = i
        i += 1
    
    if index == -1:
        raise Exception("Similarity does not Exist!")
    
    if index != -1:
        del data[module_to_remove_from][index]
        write_res_file(data)
        add_modules_to_owl()


def remove_similarity_on_delete(module_to_remove):
    data,etag = read_res_file()

    index = -1

    if module_to_remove in data.keys():
        del data[module_to_remove]

    for key,value in data.items():
        if module_to_remove in data[key]:
            if len(data[key]) == 1:
                data[key].remove(module_to_remove)
                data[key] = []
            else:
                data[key].remove(module_to_remove)

    write_res_file(data)
    add_modules_to_owl()

# takes 2 module id numbers and add the similarity to the first
def add_similarity(module_to_add_to: str, module_to_add: str):
    data,etag = read_res_file()

    if module_to_add_to not in data.keys() or module_to_add not in data.keys():
        raise Exception("Module Not Found")

    index = -1
    i = 0
    while i < len(data[module_to_add_to]):
        if data[module_to_add_to][i] == module_to_add:
            index = i
        i += 1

    if index == -1:
        data[module_to_add_to].append(module_to_add)
        write_res_file(data)
        add_modules_to_owl()
    else:
        raise Exception("Module Similarity Already Exists")


def add_module_to_res(id_to_add):
    data,etag = read_res_file()
    data[id_to_add] = []
    write_res_file(data)


def fix_similarity_changes(data):
    merged_dict = {}
    for d in data:
        for key, value in d.items():
            if key in merged_dict:
                merged_dict[key].extend(value)
            else:
                merged_dict[key] = value

    # Removing duplicates
    result = {key: list(set(value)) for key, value in merged_dict.items()}
    return result