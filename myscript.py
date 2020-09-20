from bs4 import BeautifulSoup

f=open('/home/arjun/ibm project/Project Details/Outbound/Sample.mxl','r');
document=BeautifulSoup(f.read(),"lxml-xml")

print document.EDIAssociations_OUT.AgencyID.string
print document.EDIAssociations_OUT.VersionID.string