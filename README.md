# IBM edi generator
webserver - database server <br>
Utility - utility functions

##Getting Started
<br>

1. Clone Repository using <br>``` git clone <repository_url> ```
2. Go to the webservices directory 
3. In terminal type <br> ``` npm install ```
4. In terminal type <br>``` bower install ```
5. Now run the server using <br>``` node server.js ```<br> or <br>``` nodemon server.js ```

##Database Structure

Import each csv file into mongo. Ensure that each field is a string after import. If any problems use the link.
https://drive.google.com/file/d/0B8S933miGPiSMWEwM2xvVEJOS00/view?usp=sharing <br>
It is a zip file of the dump of the mongo database. This is an updated database with indexes included.

Collections are as follows:-
-Agency.TXT           ->Agency
-Code.TXT             ->Code
-ElementUsageDefs.TXT ->ElementUsageDefs
-SegmentUsage.TXT     ->SegmentUsage
-TransactionSet.TXT   ->TransactionSet
-Version.TXT          ->Version


##Configuration

Server side configurations can be found in the webservices/config directory.
<br>Config the `database.js` file according to the name of the database in the respective system.

##Additional Details

Additional details about the server is available in the comments included in the webservice/server.js file.

##TODO

Due to some problem with grunt automation, some tasks are to be done everytime the server is updated and pulled from the repository.

1. ```sudo grunt``` in the webservices folder. 
2. Go to config folder and configure style-variables.less properly file with **grunt running**
3. Make sure that grunt recognised the change in the command line.

