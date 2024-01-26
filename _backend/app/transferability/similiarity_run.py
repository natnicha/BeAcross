import os.path

from app import config
from app.config import config_utils
from app.transferability.similiarity_logic import check_level, check_ects
from app.transferability.similiarity_logic import check_content
from app.transferability.similiarity_logic import compare_titles
from pymongo import MongoClient
from app.config.config_utils import env_config, load_env
from app.owl.modules import add_modules_to_owl
from app.api.module.model import UploadModulesResponseItemModel
import json


# TODO: ASK Natnicha for DB
def get_all_module_data(uni):
    # get all data and prepare for run
    conn = MongoClient(env_config.DB_CONNECTION_STRING)
    print(conn)
    db = conn[env_config.DB_NAME]
    data = db.get_collection("modules").find({"university": uni})
    return list(data)

def get_specific_module_data(uni):
    # get all data and prepare for run
    conn = MongoClient(env_config.DB_CONNECTION_STRING)
    print(conn)
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
    comparisons_count = (len(BUT)*len(TUC)) + (len(BUT)*len(UNG))
    for mod in BUT:
        similarity_results[str(mod.get("_id"))] = []
        for comp_mod in TUC:
            print(str(status), "/", str(comparisons_count))
            if check_similarity_db(mod, comp_mod):
                similarity_results[str(mod.get("_id"))].append(str(comp_mod.get("_id")))
            status = status + 1
        for comp_mod1 in UNG:
            print(str(status), "/", str(comparisons_count))
            if check_similarity_db(mod, comp_mod1):
                similarity_results[str(mod.get("_id"))].append(str(comp_mod1.get("_id")))
            status = status + 1
    
    status = 1
    comparisons_count = (len(TUC)*len(BUT)) + (len(TUC)*len(UNG))
    for mod in TUC:
        similarity_results[str(mod.get("_id"))] = []
        for comp_mod in BUT:
            print(str(status), "/", str(comparisons_count))
            if check_similarity_db(mod, comp_mod):
                similarity_results[str(mod.get("_id"))].append(str(comp_mod.get("_id")))
            i = i + 1
    
        for comp_mod1 in UNG:
            print(str(status), "/", str(comparisons_count))
            if check_similarity_db(mod, comp_mod1):
                similarity_results[str(mod.get("_id"))].append(str(comp_mod1.get("_id")))
            i = i + 1
    
    status = 1
    comparisons_count = (len(BUT)*len(TUC)) + (len(BUT)*len(UNG))
    for mod in BUT:
        similarity_results[str(mod.get("_id"))] = []
        for comp_mod in TUC:
            print(str(i), "/", str(comparisons_count))
            if check_similarity_db(mod, comp_mod):
                similarity_results[str(mod.get("_id"))].append(str(comp_mod.get("_id")))
            i = i + 1
        for comp_mod1 in UNG:
            print(str(i), "/", str(comparisons_count))
            if check_similarity_db(mod, comp_mod1):
                similarity_results[str(mod.get("_id"))].append(str(comp_mod1.get("_id")))
            i = i + 1
    
    # write results to json file
    with open("result.json", "w") as outfile:
        json.dump(similarity_results, outfile)


    # insert to ontology
    #TODO insert to ontology

def start_similarity_for_one(inserted_mod : UploadModulesResponseItemModel):

    #calculate transferability between modules
    data = get_specific_module_data(inserted_mod.university)

    similarity_results = read_similarity_file()

    # TODO: Validate with Natnicha The Structure Of Module
    similarity_results[str(inserted_mod.module_id)] = []

    for modu in data:
        # A to B
        if check_similarity_class(inserted_mod, modu):
            similarity_results[inserted_mod.module_id].append(modu.module_id)
        # B to A
        if check_similarity_class(modu, inserted_mod):
            similarity_results[modu.module_id].append(inserted_mod.module_id)

    write_back(similarity_results)
    add_modules_to_owl()


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

#TODO change to call from class
def check_similarity_class(module_a, module_b):
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

def read_similarity_file():

    # Get the current working directory (your_script.py's directory)
    current_directory = os.path.dirname(os.path.abspath(__file__))

    # Jump up two parent directories to the '_backend' directory
    backend_directory = os.path.dirname(os.path.dirname(current_directory))

    # Navigate to the 'owl' directory and access 'results.json'
    results_path = os.path.join(backend_directory, "app", "owl", "result.json")


    # Specify the path to your JSON file
    with open(results_path, 'r') as file:
        data = json.load(file)

    # return the dictionary
    return data


# Write the updated dictionary back to the file
def write_back(data):

    # Get the current working directory (your_script.py's directory)
    current_directory = os.path.dirname(os.path.abspath(__file__))

    # Jump up two parent directories to the '_backend' directory
    backend_directory = os.path.dirname(os.path.dirname(current_directory))

    # Navigate to the 'owl' directory and access 'results.json'
    results_path = os.path.join(backend_directory, "app", "owl", "result.json")

    with open(results_path, 'w') as file:
        json.dump(data, file, indent=2)
