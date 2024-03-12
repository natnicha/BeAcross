from app.config.azure_blob import check_etag, download_owl_file, get_etag, read_res_file, write_owl_file
from owlready2 import *
import os
import json

def find_suggested_modules(module: str) -> list:

    onto = get_ontology(get_owl_path()).load()
    # Get the individual by its name
    individual = onto.search_one(iri="*%s" % module)

    res = []
    if individual:
        if individual.similarTo:
            for i in individual.similarTo:
                res.append(i.name)
    
    return res


def add_modules_to_owl():

    delete_owl()
    create_empty_owl_file()

    onto = get_ontology(get_owl_path()).load()

    # Remove all classes, individuals, properties, and axioms
    for entity in list(onto.classes()) + list(onto.individuals()) + list(onto.properties()):
        destroy_entity(entity)

    # define ontology classes
    with onto:
        class Module(Thing):
            pass

        # Define an object property for similarity relationships
        class similarTo(ObjectProperty):
            domain = [Module]
            range = [Module]

    # Create Ontology
    sim_result,etag = read_res_file()

    # define Modules
    for key, item in sim_result.items():
        instance = Module()
        # print(key)
        instance.name = key

    # define relations
    for key, item in sim_result.items():
        # exisitng
        for i in onto.individuals():
            if i.name == key:
                res = i

        # relations similar
        for inner in item:
            found = 0
            for indv in onto.individuals():
                if indv.name == inner:
                    res.similarTo.append(indv)
                    found = 1
            if found == 0:
                instance = Module()
                instance.name = inner
                res.similarTo.append(instance)

    onto.save(get_owl_path())
    
    if check_etag(etag, get_etag("result.json")):
        update_owl_after_write()
        return
    else:
        add_modules_to_owl()

def get_owl_path():
        # Get the current working directory (your_script.py's directory)
    current_directory = os.path.dirname(os.path.abspath(__file__))

    # Jump up two parent directories to the '_backend' directory
    backend_directory = os.path.dirname(current_directory)

    # Navigate to the 'owl' directory and access 'etg.txt'
    owl_path = os.path.join(backend_directory, "owl", "modules.owl")
    
    return owl_path

def get_etg_path():
        # Get the current working directory (your_script.py's directory)
    current_directory = os.path.dirname(os.path.abspath(__file__))

    # Jump up two parent directories to the '_backend' directory
    backend_directory = os.path.dirname(current_directory)

    # Navigate to the 'owl' directory and access 'etg.txt'
    owl_path = os.path.join(backend_directory, "owl", "etg.txt")
    
    return owl_path

def write_owl_to_file_on_download():
    with open(get_owl_path(), "wb") as local_file:
        owl_data,etag = download_owl_file()
        owl_data.readinto(local_file)
        write_etg(etag= etag)

#delete local owl file
def delete_owl():
    if os.path.isfile(get_owl_path()):
        os.remove(get_owl_path())

#write an empty owl file
def create_empty_owl_file():
    fp = open(get_owl_path(), 'w')
    fp.close()

# delete 
def update_owl_after_write():
    write_owl_file(get_owl_path())
    write_owl_to_file_on_download()
    
# check if change occured since last time owl file was read
def change_occur():
    if not os.path.isfile(get_owl_path()):
        print("update_needed")
        return True

    if get_etg() == get_etag("modules.owl"):
        return False
    
    print("update_needed")
    return True
    

def write_etg(etag):
    with open(get_etg_path(), "w") as file:
        file.write(etag)

def get_etg():
    with open(get_etg_path(), "r") as file:
        return file.read()
