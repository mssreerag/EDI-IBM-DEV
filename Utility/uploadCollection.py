# Problem with Version
import pymongo as pmon						
from sys import stdout

# input('Enter the collection name : ')
client=pmon.MongoClient()
db=client['IBM']
collectionList = ["C1","C2","C3","C4","C5","C6"]

#"Agency","ElementUsageDefs","SegmentUsage","TransactionSet","Version","C1","C2","C3","C4","C5","C6"
for collectionName in collectionList:
	print(collectionName)
	path='./Data/'+collectionName+'.txt'
	if(collectionName[:1]!="C"):
		collection=db[collectionName]
	else:
		collection=db["Code"]
	fo=open(path,'r')
	content=fo.read()
	content=content.split('\n')
	header=content[0].split(';')
	res_array=[]
	for j in range(0,len(header)):
		header[j]=header[j].replace('"','')
	print(header)
	for i in range(1,len(content)-1):
		val=content[i].split(';')
		res={}
		for j in range(0,len(header)):		
			val[j]=val[j].replace('"','')
			res[header[j]]=val[j];		
		res_array.append(res)
		print("\rStatus : "+collectionName+" --> "+str(i)+"/"+str(len(content)))
	_id=collection.insert_many(res_array)
	fo.close()