from owlready2 import *
import os
import json

def find_suggested_modules(module: str) -> list:

    # Get the current working directory (your_script.py's directory)
    current_directory = os.path.dirname(os.path.abspath(__file__))

    # Jump up two parent directories to the '_backend' directory
    backend_directory = os.path.dirname(current_directory)

    # Navigate to the 'owl' directory and access 'results.json'
    owl_path = os.path.join(backend_directory, "owl", "modules.owl")

    if not os.path.isfile(owl_path):
        return []

    onto = get_ontology(owl_path).load()
    # Get the individual by its name
    individual = onto.search_one(iri="*%s" % module)

    res = []
    if individual:
        if individual.similarTo:
            for i in individual.similarTo:
                res.append(i.name)
    return res

def delete_file():
    current_directory = os.path.dirname(os.path.abspath(__file__))

    # Jump up two parent directories to the '_backend' directory
    backend_directory = os.path.dirname(os.path.dirname(current_directory))

    # Navigate to the 'owl' directory and access 'results.json'
    owl_path = os.path.join(backend_directory, "app", "owl", "modules.owl")

    if os.path.isfile(owl_path):
        # print("File exists")
        os.remove(owl_path)

def add_modules_to_owl():
    # Get the current working directory (your_script.py's directory)
    current_directory = os.path.dirname(os.path.abspath(__file__))

    # Jump up two parent directories to the '_backend' directory
    backend_directory = os.path.dirname(os.path.dirname(current_directory))

    # Navigate to the 'owl' directory and access 'results.json'
    owl_path = os.path.join(backend_directory, "app", "owl", "modules.owl")

    # print(owl_path)

    if os.path.isfile(owl_path):
        # print("File exists")
        os.remove(owl_path)

    fp = open(owl_path, 'w')
    fp.close()

    onto = get_ontology(owl_path).load()

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
    sim_result = get_results()

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

    onto.save(owl_path)


def get_results():
    # Specify the path to your JSON file
    current_directory = os.path.dirname(os.path.abspath(__file__))

    # Jump up two parent directories to the '_backend' directory
    backend_directory = os.path.dirname(os.path.dirname(current_directory))

    # Navigate to the 'owl' directory and access 'results.json'
    json_path = os.path.join(backend_directory, "app", "owl", "result.json")

    # Read the JSON file and load its content into a dictionary
    with open(json_path, 'r') as json_file:
        data_dict = json.load(json_file)

    # Now, data_dict contains the content of the JSON file as a Python dictionary
    return data_dict
