import os.path

from _backend.app import config
from _backend.app.config import config_utils
from _backend.app.transferability.similiarity_logic import check_level, check_ects
from _backend.app.transferability.similiarity_logic import check_content
from _backend.app.transferability.similiarity_logic import compare_titles
from pymongo import MongoClient
from _backend.app.config.config_utils import env_config, load_env
import json


def get_data(uni):
    # get all data and prepare for run
    conn = MongoClient("mongodb+srv://vpsad:Across1234#@across-db.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000")
    print(conn)
    db = conn["admin"]
    data = db.get_collection("modules").find({"university": uni})
    return list(data)


# Initial Run To Calculate Similarities Between All Modules

def start_similarity():

    UNG = get_data("University of Nova Gorica")
    TUC = get_data("Technische Universitat Chemnitz")
    BUT = get_data("Bialystok University Of Technology")
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
            if check_similarity(mod, comp_mod):
                similarity_results[str(mod.get("_id"))].append(str(comp_mod.get("_id")))
            status = status + 1
        for comp_mod1 in UNG:
            print(str(status), "/", str(comparisons_count))
            if check_similarity(mod, comp_mod1):
                similarity_results[str(mod.get("_id"))].append(str(comp_mod1.get("_id")))
            status = status + 1
    
    status = 1
    comparisons_count = (len(TUC)*len(BUT)) + (len(TUC)*len(UNG))
    for mod in TUC:
        similarity_results[str(mod.get("_id"))] = []
        for comp_mod in BUT:
            print(str(status), "/", str(comparisons_count))
            if check_similarity(mod, comp_mod):
                similarity_results[str(mod.get("_id"))].append(str(comp_mod.get("_id")))
            i = i + 1
    
        for comp_mod1 in UNG:
            print(str(status), "/", str(comparisons_count))
            if check_similarity(mod, comp_mod1):
                similarity_results[str(mod.get("_id"))].append(str(comp_mod1.get("_id")))
            i = i + 1
    
    status = 1
    comparisons_count = (len(BUT)*len(TUC)) + (len(BUT)*len(UNG))
    for mod in BUT:
        similarity_results[str(mod.get("_id"))] = []
        for comp_mod in TUC:
            print(str(i), "/", str(comparisons_count))
            if check_similarity(mod, comp_mod):
                similarity_results[str(mod.get("_id"))].append(str(comp_mod.get("_id")))
            i = i + 1
        for comp_mod1 in UNG:
            print(str(i), "/", str(comparisons_count))
            if check_similarity(mod, comp_mod1):
                similarity_results[str(mod.get("_id"))].append(str(comp_mod1.get("_id")))
            i = i + 1
    
    # write results to json file
    with open("result.json", "w") as outfile:
        json.dump(similarity_results, outfile)


    # insert to ontology 


# calculate transferability between modules
def check_similarity(module_a, module_b):

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

################ FOR FUTURE USE #################################

# Get the current working directory (your_script.py's directory)
current_directory = os.path.dirname(os.path.abspath(__file__))

# Jump up two parent directories to the '_backend' directory
backend_directory = os.path.dirname(os.path.dirname(current_directory))

# Navigate to the 'owl' directory and access 'results.json'
results_path = os.path.join(backend_directory, "app", "owl", "result.json")

with open(results_path, 'r') as file:
    content = file.read()
print("File content:", content)

