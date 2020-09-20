import xml.sax
import requests
import simplejson as json
import sys

url="http://localhost:3000"

class AgencyHandler(xml.sax.ContentHandler):
	def __init__(self) :
		self.CurrentData = ""
		self.AgencyID = ""
		self.VersionID = ""
		self.BindingID = ""
		

	def startElement(self,tag,attributes):
	     self.CurrentData=tag;
	     if tag=="EDIAssociations_OUT":
	     	print "EDIAssociations_OUT"

	def endElement(self,content) :
		a=self;

	def characters(self,content) :
		if self.CurrentData == "AgencyID":
			if content!='\n':	
				self.AgencyID = content
				query={'agency' : self.AgencyID }
				# res = requests.post("http://localhost:3000/api/agency/get",data = query)
				res = requests.post(url+"/api/agency/get",data = query)				
				o = json.loads(res.text)
				print o['data'][0]['Description']
						
		elif self.CurrentData == "VersionID":
					
                    if content!='\n':
                    	self.VersionID=content
                    	print self.VersionID	
                    	query={'agency' : self.AgencyID , 'version' : self.VersionID}
                    	res1 = requests.post(url+"/api/code/get", data = query)
                    	
                    	o1 = json.loads(res1.text)
                    	if o1['data'] != None:
	                    	for i in o1['data'] :
	                    		print i['Value']
	                    		print i['Description']
	                    	
                    	res = requests.post(url+"/api/version/get",data = query)
                    	o = json.loads(res.text)
                    	print o['data'][0]['Description']
                			
		elif self.CurrentData == "BindingID":
			if content!='\n':
				self.BindingID=content
				query={'agency' : self.AgencyID , 'version' : self.VersionID , 'transactionSet' : self.BindingID}
				res = requests.post(url+"/api/transactionSet/get", data = query)
				o = json.loads(res.text)
				
				print o['data'][0]['Description']
				print o['data'][0]['FunctionalGroupID']
				query={'agency' : self.AgencyID , 'version' : self.VersionID , 'transactionSet' : self.BindingID}
				res=requests.post(url+"/api/segmentUsage/get", data = query)
				o = json.loads(res.text)
				print json.dumps(o, indent=4, sort_keys=True)
				
if (__name__ == '__main__'):
	filepath=sys.argv[1]
	parser = xml.sax.make_parser()
	parser.setFeature(xml.sax.handler.feature_namespaces,0)
	Handler = AgencyHandler()
	parser.setContentHandler(Handler)
	# parser.parse("/home/arjun/ibm project/Project Details/Outbound/Sample.mxl")
	parser.parse(filepath)

	