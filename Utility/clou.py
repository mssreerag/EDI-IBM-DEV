from cloudant.client import Cloudant
from cloudant.error import CloudantException
from cloudant.result import Result, ResultByKey
db_name = "test_kub"
client = Cloudant.iam("9756c4a0-0e15-44b4-afb0-3c8edc410034-bluemix", "DtILzSIwzgvnvtbrW1GMo3s9ypcBpNTT9-Rj3pzhF2ib")
client.connect()
my_database = client.create_database(db_name)
if my_database.exists():
   print(f"'{db_name}' successfully created.")
sample_data = [
   [1, "one", "boiling", 100],
   [2, "two", "hot", 40],
   [3, "three", "warm", 20],
   [4, "four", "cold", 10],
   [5, "five", "freezing", 0]
 ]
 # Create documents by using the sample data.
# Go through each row in the array
for document in sample_data:
 # Retrieve the fields in each row.
 number = document[0]
 name = document[1]
 description = document[2]
 temperature = document[3]
 #
 # Create a JSON document that represents
 # all the data in the row.
 json_document = {
     "numberField": number,
     "nameField": name,
     "descriptionField": description,
     "temperatureField": temperature
 }
 #
 # Create a document by using the database API.
#  new_document = my_database.create_document(json_document)
data = {
    '_id': 'julia30', # Setting _id is optional
    'name': 'Julia',
    'age': 30,
    'pets': ['cat', 'dog', 'frog']
    }

# Create a document using the Database API
my_document = my_database.create_document(data)
 #
 # Check that the document exists in the database.
if new_document.exists():
    print(f"Document '{number}' successfully created.")
result_collection = Result(my_database.all_docs)
print(f"Retrieved minimal document:\n{result_collection}\n")

