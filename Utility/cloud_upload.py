import os
import json
from cloudant.client import Cloudant
from cloudant.error import CloudantException
from cloudant.result import Result, ResultByKey
print("melcow")

# db = "segment_usage"
# client = Cloudant.iam("9756c4a0-0e15-44b4-afb0-3c8edc410034-bluemix", "DtILzSIwzgvnvtbrW1GMo3s9ypcBpNTT9-Rj3pzhF2ib")
# client.connect()
print("welcome")
# my_database = client.create_database(db)
print("welcome")
f=open('./json/SegmentUsage.json')
print("opened file")
data = json.load(f)
doc=[]
max=len(data["docs"])
n=0
print(max)

    