from owlready2 import *

def find_suggested_modules(module: str) -> list:
    onto_path.append("./app/owl/")
    get_ontology("modules.owl").load()
    try:
        return list(default_world.sparql("""
            PREFIX myns: <http://www.victorypiesolutions.com/onto.owl#>
            SELECT ?y
            { myns:"""+module+""" myns:Similar ?y . }
        """))
    except:
        return []
