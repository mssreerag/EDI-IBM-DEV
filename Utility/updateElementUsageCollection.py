# Problem with Version
import sys
import pymongo						
from pymongo import MongoClient

client=MongoClient()
db=client['IBM']
codeCollection=db['Code']
elementCollection=db['ElementUsageDefs']

numberOfElements=elementCollection.count();
presentElement=0;

for x in elementCollection.find():
	
	presentElement+=1;
	percent=(presentElement/numberOfElements)*100
	# sys.stdout.write("\rCode : %s status: "+str(presentElement)+"/"+str(numberOfElements)+" :"+str(percent)+"%" % )
	# print("\rCode : "+x[u'ElementID']+" status: "+str(presentElement)+"/"+str(numberOfElements)+" :"+str(percent)+"%");
	sys.stdout.write("\rCode : "+x[u'ElementID']+" status: "+str(presentElement)+"/"+str(numberOfElements)+" :"+str(percent)+"%");
	sys.stdout.flush();

	if(presentElement>14381):		
		if codeCollection.find_one({"Agency":x[u'Agency'],"Version":x[u'Version'],"ElementID":x[u'ElementID']})==None :
			x[u'Code']='false';
		else :
			x[u'Code']='true';
			elementCollection.update_one({"_id":x[u'_id']},{"$set": {"Code": x[u'Code']}});
		# print x;

fo.close();