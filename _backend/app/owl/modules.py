from app.config.azure_blob import check_etag, download_owl_file, get_etag, read_res_file, write_owl_file
from owlready2 import *
import os
import json

def find_suggested_modules(module: str) -> list:

    write_owl_to_file_on_download()
    
    if not os.path.isfile(path()):
        return []

    onto = get_ontology(path()).load()
    # Get the individual by its name
    individual = onto.search_one(iri="*%s" % module)

    res = []
    if individual:
        if individual.similarTo:
            for i in individual.similarTo:
                res.append(i.name)
    
    delete_owl()
    return res


def add_modules_to_owl():

    delete_owl()
    create_empty_owl_file()

    onto = get_ontology(path()).load()

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

    onto.save(path())
    
    if check_etag(etag, get_etag("result.json")):
        delete_owl_after_write()
        return
    else:
        add_modules_to_owl()

def path():
        # Get the current working directory (your_script.py's directory)
    current_directory = os.path.dirname(os.path.abspath(__file__))

    # Jump up two parent directories to the '_backend' directory
    backend_directory = os.path.dirname(current_directory)

    # Navigate to the 'owl' directory and access 'results.json'
    owl_path = os.path.join(backend_directory, "owl", "modules.owl")
    
    return owl_path

def write_owl_to_file_on_download():
    with open(path(), "wb") as local_file:
        owl_data,etag = download_owl_file()
        owl_data.readinto(local_file)

def delete_owl():
    if os.path.isfile(path()):
        os.remove(path())

def create_empty_owl_file():
    fp = open(path(), 'w')
    fp.close()

def delete_owl_after_write():
    write_owl_file(path())
    delete_owl()
    