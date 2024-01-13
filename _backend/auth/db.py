import motor.motor_asyncio

DATABASE_URL = 'put mongo db connection string here'
client = motor.motor_asyncio.AsyncIOMotorClient(DATABASE_URL)
db = client.get_database("college")

student_collection = db.get_collection("students_collection")

# helpers
def student_helper(student) -> dict:
    return {
        "id": str(student["id"]),
        "email": str(student["email"]),
        "password": bytes(student["password"]),
        "first_name": str(student["first_name"]),
        "last_name": str(student["last_name"]),
        "registration_number": str(student["registration_number"]),
        "course_of_study": str(student["course_of_study"]),
        "study_semester": str(student["study_semester"]),
    }
