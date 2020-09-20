import sys
import pymongo						
from pymongo import MongoClient

client=MongoClient()
db = client.IBM
collection=db.SegmentUsage

resp=collection.create_index( [("Agency",1),("Version",1),("SegmentID",1),("Position",1)] )
print(resp)