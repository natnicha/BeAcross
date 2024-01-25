from owlready2 import *

def find_suggested_modules(module: str) -> list:
    file_name = "file://C:/Users/natni/source/repos/victory-pie-solutions/victory-pie-solutions/_backend/app/owl/modules.owl"
    get_ontology(file_name).load()
    # onto = get_ontology("http://www.lesfleursdunormal.fr/static/_downloads/pizza_onto.owl")
    # onto.save(file = "test", format = "rdfxml")
    try:
        return list(default_world.sparql("""
            PREFIX myns: <http://www.victorypiesolutions.com/onto.owl#>
            SELECT ?y
            { myns:"""+module+""" myns:Similar ?y . }
        """))
    except:
        return []
