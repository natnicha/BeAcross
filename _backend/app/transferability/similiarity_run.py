from _backend.app import config
from _backend.app.config import config_utils
from similiarity_logic import check_level, check_ects
from similiarity_logic import check_content
from similiarity_logic import compare_titles
from pymongo import MongoClient
from _backend.app.config.config_utils import env_config, load_env


def get_data(uni):
    #get all data and prepare for run
    conn = MongoClient("mongodb+srv://vpsad:Across1234#@across-db.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000")
    print(conn)
    db = conn["admin"]
    collec = db.get_collection("modules").find({"university": uni})
    return list(collec)


def start():

    UNG = get_data("University of Nova Gorica")
    TUC = get_data("Technische Universitat Chemnitz")
    BUT = get_data("Bialystok University Of Technology")
    print(len(UNG))
    print(len(TUC))
    print(len(BUT))

    results = dict()
    for mod in BUT:
        results[mod.get("_id")] = []
        for comp_mod in TUC:
            if check_similarity(mod, comp_mod):
                results[mod.get("_id")].append(comp_mod.get("_id"))

    for key, value in results.items():
        print(key, value)





def check_similarity(module_a, module_b):

    level = check_level(module_a.get("degree_level"), module_b.get("level"))
    content = check_content(module_a.get("content"), module_b.get("content"))
    name = compare_titles(module_a.get("name"), module_b.get("name"))
    ects = check_ects(module_a.get("ects"), module_b.get("ects"))

    # content is not at all similiar and ects don't match and level does not match
    if content < -0.19 or not ects or not level:
        return False
    # very similar content
    if level and ects and content > 0.4:
        return True
    # name matches good and some similar content
    if level and ects and name > 0.7 and content > 0.19:
        return True
    # good ratio between name and content
    if level and ects and name > 0.4 and content > 0.4:
        return True
    return False

start()


