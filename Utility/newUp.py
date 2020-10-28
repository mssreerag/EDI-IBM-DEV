# Problem with Version
import pymongo as pmon						
from sys import stdout
import json
import os
from cloudant.client import Cloudant
from cloudant.error import CloudantException
from cloudant.result import Result, ResultByKey
def uploadInChunks(array,database):
    print("entering" ,len(array))
    size=5000
    k=0
    numIteration=len(array)/size
    n=0
    upload=[]
    for i in array:
        upload.append(i)
        k=k+1
        if(k==size):
            k=0
            database.bulk_docs(upload)
            upload.clear()
            n=n+1
            print(n,'/',numIteration,"#")
    database.bulk_docs(upload)

        
def progbar(curr, total, full_progbar):
    frac = curr/total
    filled_progbar = round(frac*full_progbar)
    print('\r', '#'*filled_progbar + '-'*(full_progbar-filled_progbar), '[{:>7.2%}]'.format(frac), end='')
client=pmon.MongoClient()
client = Cloudant.iam("50f9263f-7881-4a8f-8ee8-5280df1db57a-bluemix", "JzHBtp05D6pQTbTbr-KCmkKHmDnXFQ33gmmCEVNrer5d")
client.connect()
collectionList =  ["C1"]

# ,"C1","C2","C3","C4","C5","C6","ElementUsageDefs","SegmentUsage","TransactionSet","Version"

for collectionName in collectionList:
    print(collectionName," Created...")
    path='./Data/'+collectionName+'.txt'
    if(collectionName[:1]!="C"):
        collection=collectionName
    else:
        collection="code"
    my_database = client.create_database(collection)

    fo=open(path,'r')
    content=fo.read()
    content=content.split('\n')
    # upload_collection={}
    header=content[0].split(';')
    # upload_collection["_id"]=collection
    for j in range(0,len(header)):
        header[j]=header[j].replace('"','')
    print(header)
    print(len(content))
    res_array=[]
    res_array.clear()
    for i in range(1,len(content)-1):
        val=content[i].split(';')
        progbar(i, len(content)-1, 100)
        res={}
        for j in range(0,len(header)):
            val[j]=val[j].replace('"','')
            if(str(val[j])!="" or header[j]!='Release'):
                res[header[j]]=str(val[j])
        res_array.append(res)
        # print(res_array["doc"])
    # upload_collection["data"]=res_array
    uploadInChunks(res_array,my_database)
    fo.close()
    # print("upload phase")
    # doc=[]
    # n=0
    # max=len(res_array["docs"])
    # k=0
    # for i in res_array["docs"]:
    #     doc.append(i)
    #     n=n+1
    #     if(n>=max/50):
    #         k=k+1
    #         print('\r',k,'/',max/50,end='')
    #         my_database.bulk_docs(doc)
    #         n=0
    #         doc=[]

    
    # print("val",len(res_array["docs"]))

        
            

            



        