import csv

def progbar(curr, total, full_progbar):
    frac = curr/total
    filled_progbar = round(frac*full_progbar)
    print('\r', '#'*filled_progbar + '-'*(full_progbar-filled_progbar), '[{:>7.2%}]'.format(frac), end='')



fo=open('./Data/element_usage_defs.txt','r')
content=fo.read()
content=content.split('\n')
# upload_collection={}
Segment=[]
TempSegment=[]
header=content[0].split(';')
for i in range(1,len(content)-1):
    val=content[i].split(';')
    for j in range(0,len(val)):
        val[j]=val[j].replace('"','')
    if val[3] not in TempSegment:
        print(val[3],"-->",i)
        TempSegment.append(val[3])
        Segment.append(["ElementID",val[3]])
    
    # res_array.append(res)
with open('Element.csv', 'w') as csvfile:
    fieldnames = ['first_name', 'last_name']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    spamwriter = csv.writer(csvfile)
    print(Segment)
    for i in TempSegment:
        writer.writerow({'first_name': 'ElementID', 'last_name': i})

    