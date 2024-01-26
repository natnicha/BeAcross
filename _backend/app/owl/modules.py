from owlready2 import *
import os
import json

def find_suggested_modules(module: str) -> list:
    onto_path.append("./app/owl/")
    get_ontology("modules.owl").load()
    try:
        return list(default_world.sparql("""
            PREFIX myns: <http://www.victorypiesolutions.com/onto.owl#>
            SELECT ?y
            { myns:""" + module + """ myns:Similar ?y . }
        """))
    except:
        return []


def add_modules_to_owl():

    # recreate ontology ## maybe as an improvement create a different file and then delete and replace
    if os.path.isfile("modules.owl"):
        os.remove("modules.owl")

    fp = open('modules.owl', 'w')
    fp.close()

    onto_path.append("./app/owl/")
    onto = get_ontology("modules.owl").load()

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
        instance.name = key

    # define relations
    for key, item in sim_result.items():
        for i in onto.individuals():
            if i.name == key:
                res = i

        for inner in item:
            found = 0
            for i in onto.individuals():
                if i.name == inner:
                    res.similarTo.append(i)
                    found = 1
            if found == 0:
                instance = Module()
                instance.name = inner
                res.similarTo.append(instance)

    onto.save("modules.owl")


    # # Access classes in the ontology
    # for cls in onto.classes():
    #     print("Class:", cls)
    #
    # # Access individuals in the ontology
    # for ind in onto.individuals():
    #     print("Individual:", ind)
    #
    # # Access properties in the ontology
    # for prop in onto.properties():
    #     print("Property:", prop)



def get_results():
    # Specify the path to your JSON file
    json_file_path = "result.json"

    # Read the JSON file and load its content into a dictionary
    with open(json_file_path, 'r') as json_file:
        data_dict = json.load(json_file)

    # Now, data_dict contains the content of the JSON file as a Python dictionary
    return data_dict


add_modules_to_owl()