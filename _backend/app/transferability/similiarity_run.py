from similiarity_logic import check_level
from similiarity_logic import check_content

module_a = {
    "name": "Operating systems",
    "degree-program": "Professorship of Operating Systems",
    "level": " Bachelor",
    "content": "Content:classification of operating systems; architectural principles; Hierarchical layer model; Resources; forms of activity; Threads; control of critical sections; process communication; Deadlock; data transmission; memory management; mass storage; Administration; Security Aim:Acquisition of knowledge of essential architectural and functional principles of operating systems",
    "uni-code": "565150",
    "ECTS": 5,
    "program": "Applied Computer Science",
    "university": "Technische Universitat Chemnitz"
},

module_b = {
    "name": "Basics of computer science I",
    "degree-program": "Head of the Faculty Computing and Information Center of the Faculty of Computer Science",
    "level": " Bachelor",
    "content": "Content:light in the structure and mode of action of digital computers Insert in a concrete higher programming language simple sorting and search algorithms Introduction to the technology of software development Aim:The students are able to design simple algorithms, implement them in a modern programming language and thus solve tasks in the fields of natural sciences, electrical engineering, mechanical engineering and mathematics. They use simple search and sorting algorithms, numerical methods and recursive functions. Furthermore, you can apply the development process to simple problems in software development.",
    "uni-code": "250110-001",
    "ECTS": 5,
    "program": "physics",
    "university": "Technische Universitat Chemnitz"
}

def start():
    print(check_level(module_a.get("level"),module_b.get("level")))
    print(check_content(module_a.get("content"),module_b.get("content")))


#def retrieve_modules():



start()