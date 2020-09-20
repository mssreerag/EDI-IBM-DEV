import xml.etree.ElementTree as ET
import sys
import requests
import simplejson as json
from StringIO import StringIO


tree = ET.parse(sys.argv[1])
root = tree.getroot()
nm='{http://www.stercomm.com/SI/Map}'
url = "http://localhost:3000"
agency=""
version=""
bindingId=""
pos = " "
posSeg=" "
loopId =" "
queryPdf ={}
query1 = ""
Tdescription =" "
TfunctionalId =" "
active=" "
queryEle ={}
for child in root.iter(nm+'EDIAssociations_OUT'):
	agency = child.find(nm+'AgencyID').text
	version = child.find(nm+'VersionID').text
	bindingId = child.find(nm+'BindingID').text
	query={'agency': agency}
	res = requests.post(url+"/api/agency/get",data = query)	
	o = json.loads(res.text)
	print o['data'][0]['Description']
	query={'agency': agency , 'version' : version}
	res = requests.post(url+"/api/version/get",data = query)
	o = json.loads(res.text)
	print o['data'][0]['Description']
	query={'agency' : agency , 'version' : version , 'transactionSet' : bindingId}
	res = requests.post(url+"/api/transactionSet/get", data = query)
	o = json.loads(res.text)
	print'xyz'
	print o['data'][0]['Description']
	Tdescription = o['data'][0]['Description']
	print o['data'][0]['FunctionalGroupID']
	TfunctionalId = o['data'][0]['FunctionalGroupID']
	
	





posSeg = 0
i=-1
for ch in root.iter(nm+'OUTPUT'):

	for child in ch.iter(nm+'Segment'):
		active = child.find(nm+'Active').text
		posSeg+=1
		print posSeg
		if(active=='1') :
			print "::::::::::::::::::::::::"
			for block in child.findall(nm+'BlockSig') :
				tag = block.find(nm+'Tag')
				i+=1
				if(tag!=None) :
					print tag.text
					query={'agency':agency ,'version':version ,'transactionSet':bindingId,'segment':posSeg}
					res=requests.post(url+"/api/segmentUsage/getFromPosition", data = query)
					o = json.loads(res.text)
					
					pos = 0

					if o['data']!=None :
						
						#print 'loopID'+o['data'][0]['LoopID']
						
						# queryPdf={posSeg:o['data']}
						io=StringIO()
						json.dump(o['data'],io)
						print io.getvalue()
						
						# print('data');
						# print(o['data']);

						queryPdf[str(posSeg)]={};
						queryPdf[str(posSeg)]=o['data'][0];

						# queryPdf[str(posSeg)]=queryPdf[str(posSeg)].replace('"',"'");

						# queryPdf.insert(i,io.getvalue())

						

						#query1={'version':version,'transactionSet' :bindingId,'transactionDescription':Tdescription,'transactionFunctionalGroup':TfunctionalId,'numberOfElementsInSegment':queryEle,'elementUsageDefs':'{}', 
	#'headingText':'','footerText':'','businessPartnerText':'jhgv2','numberOfHeadingSegments':1,'numberOfDetailSegments':2,'segmentUsage':{posSeg,queryPdf},'numberOfSummarySegments':3,'segmentText':"{}",'code':"{}"}
						
							
					active =0
					for field in child.iter(nm+'Field'):

						for active_in_field in field.findall(nm+'Active'):
							pos+=1
							if(int(active_in_field.text)==1) :
								active+=1

								for name_in_field in field.findall(nm+'Name'):
									
									
									print "element ID is : :"+name_in_field.text
									query={'agency':agency ,'version':version , 'segmentId':tag.text,'position':pos}
									res=requests.post(url+"/api/elementUsageDefs/getFromPosition", data = query)
									o = json.loads(res.text)
									if o['data']!=None :
										print "element ID is"+name_in_field.text
										print 'Description of element'+name_in_field.text+' has '+o['data'][0]['Description']
					#print active	

					# queryEle.insert(i,active)

					queryEle[str(posSeg)]=i;	
									
					#query1={'version':version,'transactionSet' :bindingId,'transactionDescription':Tdescription,'transactionFunctionalGroup':TfunctionalId,'numberOfElementsInSegment':active,'elementUsageDefs':'{}', 
	#'headingText':'','footerText':'','businessPartnerText':'jhgv2','numberOfHeadingSegments':1,'numberOfDetailSegments':1,'segmentUsage':queryPdf,'numberOfSummarySegments':1,'segmentText':"{}",'code':"{}"}
	#requests.post(url+"/api/pdf/create",data = query1)

print 'xyz'

print query1

#query1['segmentUsage']=query1['segmentUsage']+'';

# queryPdf=str(queryPdf);

query1={'version':version,'transactionSet' :bindingId,'transactionDescription':Tdescription,'transactionFunctionalGroup':TfunctionalId,'numberOfElementsInSegment':json.dumps(queryEle),'elementUsageDefs':'{}', 
	'headingText':'','footerText':'','businessPartnerText':'jhgv2','numberOfHeadingSegments':1,'numberOfDetailSegments':1,'segmentUsage':json.dumps(queryPdf),'numberOfSummarySegments':1,'segmentText':"{}",'code':"{}"}
requests.post(url+"/api/pdf/create",data = query1)
						



