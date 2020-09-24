'use strict';

var database = require('../config/database');
// var ldapConfig = require('../config/ldap');
var genRes = require('./controllers/genres.js');
const Cloudant = require('@cloudant/cloudant');


var agency = require('./controllers/Agency.js');
var version = require('./controllers/Version.js');
var versionModel = require('./models/Version.js');
var transactionSet = require('./controllers/TransactionSet.js');
var segmentUsage = require('./controllers/SegmentUsage.js');
var segmentDescription = require('./controllers/SegmentDescription.js');
var elementUsageDefs = require('./controllers/ElementUsageDefs.js');
var code = require('./controllers/Code.js');
var ediLog = require('./controllers/EdiLog.js');
var ediDraft = require('./controllers/EdiDraft.js');
var firebaseCredentials = require('../config/firebaseLogin.js')
var firebase = require("firebase");
//cloudant api import
var cloudantAgency = require('./onlinecontrollers/Agency');
var cloudantVersion = require('./onlinecontrollers/Version');
var cloudantTransactionSet = require('./onlinecontrollers/TransactionSet');
var cloudantSegmentUsage = require('./onlinecontrollers/SegmentUsage');
var cloudantElementUsage = require('./onlinecontrollers/ElementUsageDefs');
var cloudantCode = require('./onlinecontrollers/code');
var cloudantEdiLog = require('./onlinecontrollers/EdiLog');
var cloudantSegmentDescription= require('./onlinecontrollers/SegmentDescription')


//Required include
var _ = require('underscore');
var fs = require('fs');
// var dimension = require('image-size');
var path = require('path');
var crypto = require('crypto');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var cc = require('coupon-code');
var pdfkit = require('pdfkit');
// var ldap = require('ldapjs');
var handlebars = require('handlebars');
const {
	query
} = require('express');
var ldapClient;

//var doc = new jsPDF("portrait","px","a4");

//local variables
var numberOfElements = 0;
var numberOfElementsRetrieved = 0;

//user defined modules

// ldapClient = ldap.createClient(ldapConfig.options);
// var ldapUserQuery = ldapConfig.userQuery.user;
// var handleUserQueryTemplate = handlebars.compile(ldapUserQuery);

//firebase auth setup(admin not added)
firebase.initializeApp(firebaseCredentials.firebaseConfig);

mongoose.connect(database.url);
mongoose.connection.on('error', console.error.bind(console, 'connection error:')); // Error handler
var db = mongoose.connection;


// cloudant start

// const vcap = require('./CloudantApi/vcap_local.json');

// function dbCloudantConnect() {
//     return new Promise((resolve, reject) => {
//         Cloudant({  // eslint-disable-line
//             url: vcap.services.cloudantNoSQLDB.credentials.url
//         }, ((err, cloudant) => {
//             if (err) {
//                 console.log('Connect failure: ' + err.message + ' for Cloudant DB: ' +
//                     "agency");
//                 reject(err);
//             } else {
//                 let db = cloudant.use("agency");
//                 console.log('Connect success! Connected to DB: ' + "agency");
//                 resolve(db);
//             }
//         }));
//     }).catch(

// 		console.log("HOLY MOLY.."));
// }
// let dbase;

// // Initialize the DB when this module is loaded
// (function getDbConnection() {
//     dbCloudantConnect().then((database) => {
//         console.log('Cloudant connection initialized');
// 		dbase = database;
// 		// dbase = cloudant.use("agency");

//     }).catch((err) => {
//         console.log('Error while initializing DB: ' + err.message, 'items-dao-cloudant.getDbConnection()');
// 		throw err;

//     });
// })();

// function findByDescription(partialDescription) {
//     return new Promise((resolve, reject) => {
//         let search = `.*${partialDescription}.*`;
//         dbase.find({
// 			"selector": {

// 				  "Agency":"X"

// 		 }}, (err, documents) => {
//             if (err) {
// 				console.log(err);
// 				throw err;
//             } else {
// 				console.log("Asdasd");
// 				resolve({ data: JSON.stringify(documents.docs), statusCode: (documents.docs.length > 0) ? 200 : 404 });
// 				console.log(JSON.stringify(documents.docs));
//             }
//         });
//     });
// }


// cloudant end

var invalid_auth_error = "Invalid session : auth failed";

exports.index = function (req, res) {
	if (res) {
		res.send('You got yourself into the api');
	} else {
		res.send('Invalid Request');
	}
}

/*
Middleware functions for api/*
*/

//Authentication and session management with LDAP

exports.authenticate = function (req, res) {
	var params = req.body;
	var username = params.user;
	var password = params.password;
	var userFound = false;
	if (username == null || username == '' || password == null || password == '') {
		console.log(params, req.header);
		res.send({
			status: false,
			message: 'Parameter Problem',
			pass: "sadas" + password,
			usr: username
		});
	} else {
		firebase.auth().signInWithEmailAndPassword(username, password).catch(function (error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log(errorCode);
			console.log(errorMessage);
			console.log("Mayday!!!");
			console.log(username);
		});
		firebase.auth().onAuthStateChanged(function (user) {
			if (user) {

				console.log("user logged in");
				// User is signed in.
				var displayName = user.displayName;
				var email = user.email;
				req.session.user = email;
				if (email == "sreeragms@notamail.com")
					req.session.privilege = 0;
				else
					req.session.privilege = 1;
				req.session.name = email;
				console.log(displayName + email);
				res.send({
					status: true,
					message: 'Authentication Success'
				});
			} else {
				console.log("User not found or... something else");
			}
		});


		// 	// var data={
		// 	// 	username : username
		// 	// };
		// 	// var result=handleUserQueryTemplate(data);

		// 	var opts = {
		// 	  filter: ldapConfig.usernameAttribute+'='+username,
		// 	  scope: 'sub',
		// 	  attributes: ['dn','cn']
		// 	};

		// 	ldapClient.search(ldapConfig.baseDN,opts, function(err, result) {

		// 	  result.on('searchEntry', function(entry) {
		// 	    console.log('entry: ' + JSON.stringify(entry.object));

		// 	   	var name=entry.object['cn'];

		// 	   	console.log('name'+name);

		// 	    if(!userFound)
		// 	    {
		// 	    	userFound=true;
		// 	    	var bindParams=entry['dn'];

		// 	    	ldapClient.bind(bindParams, password, function(err) {	  	
		// 				if(!err)
		// 				{
		// req.session.user=username;
		// 					req.session.privilege=1;
		// 					req.session.name=name;

		// 					// if(username==ldapConfig.admin)
		// 					// {
		// 					// 	req.session.privilege=0;
		// 					// }

		// 					var opts = {
		// 					  filter: ldapConfig.adminMemberAttribute+'='+bindParams,
		// 					  scope: 'sub',
		// 					  attributes: ['dn']
		// 					};

		// 					console.log('adminOpts');
		// 					console.log(opts);
		// 					ldapClient.search(ldapConfig.adminGroup,opts, function(err, result) {

		// 						result.on('searchEntry', function(entry) {
		// 							console.log('admin');
		// 							req.session.privilege=0;
		// 	  					});

		// 	  					result.on('searchReference', function(referral) {
		// 						    console.log('referral: ' + referral.uris.join());
		// 						});

		// 						result.on('error', function(err) {
		// 						  console.error('admin error: ' + err.message);
		// 						});

		// 						result.on('end', function(result) {
		// 						  console.log('status: ' + result.status);
		// 						  res.send({status:true,message:'Authentication Success'});
		// 						});

		// 					});
		// 				}
		// 				else
		// 				{
		// 					req.session.user='';
		// 					var t={status:false,message:'Password Incorrect'};
		// 					res.send(t);	
		// 				}
		// 			});
		// 	    }
		// 	  });

		// 	  result.on('searchReference', function(referral) {
		// 	    console.log('referral: ' + referral.uris.join());
		// 	  });

		// 	  result.on('error', function(err) {
		// 	    console.error('error: ' + err.message);
		// 	  });

		// 	  result.on('end', function(result) {
		// 	    console.log('status: ' + result.status);
		// 	    if(!userFound)
		// 	  	{
		// 	  		res.send({status:false,message:'Invalid User'});	
		// 	  	}
		// 	  });
		// 	});

		// 	//res.send({status:false,message:'Authentication Success'});

		// 	// ldapClient.bind("cn=arjun,c=in,ou=bluepages,dc=test,dc=com", "arjun", function(err) {	  	
		// 	// 	if(!err)
		// 	// 	{
		// 	// 		req.session.user=username;
		// 	// 		req.session.privilege=1;

		// 	// 		if(username==ldapConfig.admin)
		// 	// 		{
		// 	// 			req.session.privilege=0;
		// 	// 		}

		// 	// 		res.send({status:true,message:'Authentication Success'});
		// 	// 	}
		// 	// 	else
		// 	// 	{
		// 	// 		req.session.user='';
		// 	// 		var t={status:false,message:'Invalid User',error: err};
		// 	// 		res.send(t);	
		// 	// 	}
		// 	// });

	}
}

exports.getSession = function (req, res) {
	// console.log(req.session);
	if (req.session.user) {
		console.log("name :" + req.session.name)
		res.send({
			status: true,
			privilege: req.session.privilege,
			name: req.session.name
		});
	} else {
		res.send({
			status: false,
			privilege: -1
		});
	}
}

exports.clearSession = function (req, res) {
	delete req.session.user;
	delete req.session.privilege;
	delete req.session.name;
	firebase.auth().signOut().then(function () {
		console.log("logged out");
	}).catch(function (error) {
		console.log("error logging out");
	});
	res.send({
		status: true
	});
}

//Get Agency Api /api/getAgency

exports.getAgency = function (req, res) {
	var params = req.body;
	var query = {
		"selector": {

			"Agency": params.agency
		}
	};
	cloudantAgency.get(query, function (msg, data) {
		var obj = JSON.parse(msg);
		obj.data = data;
		res.send(JSON.stringify(obj));
	});
}

exports.getAllAgency = function (req, res) {

	var params = req.body;
	var query = {
		"selector": {
			"_id": {
				"$gt": "0"
			}
		}
	};

	cloudantAgency.get(query, function (msg, data) {
		var obj = JSON.parse(msg);
		obj.data = data;
		res.send(JSON.stringify(obj));
	});
}

//Get Version Api /api/getVersion

exports.getVersion = function (req, res) {
	var params = req.body;
	var query = {
		// Agency : params.agency ,
		// Version : params.version
		"selector": {


			"Agency": params.agency,
			"Version": params.version
		}
	};
	cloudantVersion.get(query, function (msg, data) {
		var obj = JSON.parse(msg);
		obj.data = data;
		res.send(JSON.stringify(obj));
	});
}

exports.getAllVersion = function (req, res) {
	var params = req.body;
	console.log("params", req.body);
	var query = {
		"selector": {
			"Agency": params.agency
		}
	};
	cloudantVersion.get(query, function (msg, data) {
		var obj = JSON.parse(msg);
		obj.data = data;
		res.send(JSON.stringify(obj));
	});
}

//Get Transaction Set Api /api/getTransactionSet

exports.getTransactionSet = function (req, res) {
	var params = req.body;
	var query = {
		"selector": {
			"Agency": params.agency,
			"Version": params.version,
			"TransactionSet": params.transactionSet
		}
	};
	cloudantTransactionSet.get(query, function (msg, data) {
		var obj = JSON.parse(msg);
		obj.data = data;
		res.send(JSON.stringify(obj));
	});
}

exports.getAllTransactionSet = function (req, res) {
	var params = req.body;
	var query = {
		"selector": {
			"Agency": params.agency,
			"Version": params.version
		}
	};
	cloudantTransactionSet.get(query, function (msg, data) {
		var obj = JSON.parse(msg);
		obj.data = data;
		res.send(JSON.stringify(obj));
	});
}

//Get Segment Description Api /api/segmentDescription/get

exports.getSegmentDescription = function (req, res) {
	var params = req.body;
	var query = {
		"AGENCY": params.agency,
		"Version": params.version,
		"SegmentID": params.segment
	};
	segmentDescription.get(query, function (msg, data) {
		var obj = JSON.parse(msg);
		obj.data = data;
		res.send(JSON.stringify(obj));
		console.log("JSON Description");
	});
}

//Get Segment Usage Api /api/getSegmentUsage

exports.getSegmentUsage = function (req, res) {
	var params = req.body;
	var obj = {};
	var query = {
		"selector": {

		"Agency": params.agency,
		"Version": params.version,
		"TransactionSetID": params.transactionSet,
		"SegmentID": params.segment
		}
	};
	cloudantSegmentUsage.get(query, function (msg, data) {
		obj = JSON.parse(msg);
		obj.data = data;
		if (data != undefined && data.length > 0) {
			query = {
		"selector": {

				"AGENCY": params.agency,
				"Version": params.version,
				"SegmentID": params.segment
		}
			};
			cloudantSegmentDescription.get(query, function (msg, data) {
				msg = JSON.parse(msg);
				obj.status = msg.status;
				obj.message = msg.message;
				if(data!=null)
					obj.description = data[0]['Description'];
				res.send(JSON.stringify(obj));
			});
		} else {
			console.log("No segment found");
			res.send(JSON.stringify(obj));
		}
	});
}

exports.getSegmentUsageFromPosition = function (req, res) {
	var params = req.body;
	var query = {
		"selector": {
			"Agency": params.agency,
			"Version": params.version,
			"TransactionSetID": params.transactionSet,
			"Position": params.segment
		}
	};
	console.log(query);
	console.log(req.body);
	cloudantSegmentUsage.get(query, function (msg, data) {
		var obj = JSON.parse(msg);
		obj.data = data;
		console.log("segment data", obj);
		//res.send(JSON.stringify(obj));
		if (data && data.length > 0) {
			query = {
				"AGENCY": params.agency,
				"Version": params.version,
				"SegmentID": data[0]['SegmentID']

			};

			console.log("query for description: ", query);
			segmentDescription.get(query, function (msg, data) {
				console.log(msg);
				console.log(data, "message");
				msg = JSON.parse(msg);
				obj.status = msg.status;
				obj.message = msg.message;
				if (data == null)
					obj.description = null;
				else
					obj.description = data[0]['Description'];

				res.send(JSON.stringify(obj));
			});
		} else {
			console.log("No segment found");
			res.send(JSON.stringify(obj));
		}
	});
}

exports.getAllSegmentUsage = function (req, res) {
	var params = req.body;
	var query = {
		"selector": {
			"Agency": params.agency,
			"Version": params.version,
			"TransactionSetID": params.transactionSet,
		}
	};
	cloudantSegmentUsage.get(query, function (msg, data) {
		var obj = JSON.parse(msg);
		obj.data = data;
		console.log(obj);
		res.send(JSON.stringify(obj));
	});
}


//Get ElementUsageDefs Api /api/getElementUsageDefs

exports.getMandatoryElementStatus = function (req, res) {
	var params = req.body;
	var query = {
		"selector": {
			"Agency": params.agency,
			"Version": params.version,
			"SegmentID": params.segmentId,
			"RequirementDesignator": 'M'
		}
	};
	cloudantElementUsage.get(query, function (msg, data) {
		var obj = JSON.parse(msg);
		obj.data = data;
		res.send(JSON.stringify(obj));
	});
}

exports.getElementUsageDefs = function (req, res) {
	var params = req.body;
	var query = {
		"selector": {
			"Agency": params.agency,
			"Version": params.version,
			"SegmentID": params.segmentId,
		}
	};
	cloudantElementUsage.get(query, function (msg, data) {
		var obj = JSON.parse(msg);
		obj.data = data;
		res.send(JSON.stringify(obj));
	});
}

exports.getElementUsageDefsFromPosition = function (req, res) {
	var params = req.body;
	var segmentPosition = params.segmentPosition;
	var query = {
		"selector": {
			"Agency": params.agency,
			"Version": params.version,
			"SegmentID": params.segmentId,
			"Position": params.position
		}
	};
	cloudantElementUsage.get(query, function (msg, data) {
		var obj = JSON.parse(msg);
		obj.data = data;
		obj.segmentPosition = segmentPosition;
		res.send(JSON.stringify(obj));
	});

}

exports.getElementUsageDefsWithCode = function (req, res) {
	var params = req.body;
	var query = {
		"selector": {
			"Agency": params.agency,
			"Version": params.version,
			"SegmentID": params.segmentId
		}
	};
	console.log(query);
	cloudantElementUsage.get(query, function (msg, data) {
		console.log("getwithcode");

		var obj = JSON.parse(msg);
		obj.data = data;

		// console.log(data);
		// try{
		numberOfElements = data.length;
		// }
		// catch{
		// 	numberOfElements=0
		// }

		if (numberOfElements == 0) {
			res.send(obj);
		} else {
			// getCodeWithElement(obj, res);
			numberOfElementsRetrieved = 0;
			var codeQuery = {
				"selector": {

				}
			}
			var queryArray = []
			for (var k = 0; k < data.length; k++) {
				console.log(data[k]["Agency"])

				var indivQuery = {
					"Agency": data[k]['Agency'],
					"Version": data[k]['Version'],
					"ElementID": data[k]['ElementID']
				}
				queryArray.push(indivQuery);


			}
			codeQuery["selector"]["$or"] = queryArray;
			console.log("queryarray", JSON.stringify(codeQuery));

			cloudantCode.get(codeQuery, (message, datum) => {
				if (datum == null) {
					console.log(datum);
					console.log("null return code -elem combo");
					res.send(JSON.stringify(obj));
				} else {
					// var result = JSON.parse(message);
					// result.datum = datum;
					// console.log("datum",datum);
					console.log("obj len", datum.length);
					console.log("obj len", datum);

					for (var j = 0; j < obj.data.length; j++) {
						var flag = false;
						for (var i = 0; i < datum.length; i++) {
							if (obj.data[j]["ElementID"] == datum[i]["ElementID"]) {
								flag = true;
								console.log("flagged", obj.data[j]["ElementID"]);
								obj.data[j]["Code"] = flag
								break;
							}
							obj.data[j]["Code"] = flag

						}
					}
					console.log("not null return code -elem combo", obj);
					res.send(JSON.stringify(obj));
				}

			});
		}
	});
}

//Get Code Api /api/getCode

exports.getCode = function (req, res) {
	var params = req.body;
	var query = {
		"selector": {
			"Agency": params.agency,
			"Version": params.version,
			"ElementID": params.element
		}
	};

	cloudantCode.get(query, function (msg, data) {
		var obj = JSON.parse(msg);
		obj.data = data;
		res.send(JSON.stringify(obj));
	});
}

function getCodeFromElem(obj, res) {
	var params = obj.data;
	var indivQuery;
	var query = {
		"selector": {
			"$or": [

			]
		}
	}
	var queryArray = []
	params.forEach(i => {
		console.log(i["Agency"])
		indivQuery = {
			"Agency": i['Agency'],
			"Version": i['Version'],
			"ElementID": i['ElementID']
		}
		queryArray.push(indivQuery);



	});
	console.log("queryarray", queryArray);
	query["selector"]["$or"] = queryArray;
	query = JSON.stringify(query)
	console.log("query for codes-elem", query);

	cloudantCode.get(query, (msg, data) => {
		if (data == null) {
			console.log(data);
			console.log("null return code -elem combo");
			res.send(JSON.stringify(obj));
		} else {
			var result = JSON.parse(msg);
			result.data = data;
			for (var j = 0; j < params.length; j++) {
				var flag = false;
				for (var i = 0; i < data.length; i++) {
					if (obj.data[j]["ElementID"] == data[i]["ElementID"]) {
						flag = true;
						break;
					}
					obj.data[j]["Code"] = flag
				}
			}
			console.log("not null return code -elem combo", obj);
			res.send(JSON.stringify(obj));
		}
	});
}

function getCodeWithElement(obj, res) {
	// console.log(numberOfElementsRetrieved+"/"+numberOfElements);
	if (numberOfElementsRetrieved < numberOfElements) {
		obj.data[numberOfElementsRetrieved]['Code'] = "";
		var params = obj.data[numberOfElementsRetrieved];
		var query = {
			"Agency": params['Agency'],
			"Version": params['Version'],
			"ElementID": params['ElementID']
		};

		code.getOne(query, function (msg, data) {
			obj.data[numberOfElementsRetrieved]['Code'] = JSON.parse(msg)['status'];
			//console.log(msg["message"]);
			// console.log(obj.data[numberOfElementsRetrieved]['Code']);
			// obj.data[numberOfElementsRetrieved]['code']=msg.status;
			numberOfElementsRetrieved++;
			getCodeWithElement(obj, res);
		});
	} else {
		console.log(obj)
		res.send(obj);
		// res.send(JSON.stringify(obj.data.Code));
	}
}

function getCodeWithElement2(obj, res) {
	console.log(numberOfElementsRetrieved + "/" + numberOfElements);
	// //console.log(obj);
	// // if (numberOfElementsRetrieved < numberOfElements) {
	// for (var i = 0; i < numberOfElements; i++) {
	// 	obj.data[i]['Code'] = "";
	// 	var params = obj.data[i];
	// 	var query = {
	// 		"selector": {
	// 			"Agency": params['Agency'],
	// 			"Version": params['Version'],
	// 			"ElementID": params['ElementID']
	// 		}
	// 	};
	// 	//		code.getOne(query, function (msg, data) {

	// 	cloudantCode.get(query, function (msg, data) {
	// 		// console.log("3");
	// 		console.log(data);
	// 		if(data!=null){
	// 		obj.data[i]['Code'] = JSON.parse(msg)['status'];
	// 	}
	// 		//console.log(msg["message"]);
	// 		// console.log(obj.data[numberOfElementsRetrieved]['Code']);
	// 		// obj.data[numberOfElementsRetrieved]['code']=msg.status;
	// 		// numberOfElementsRetrieved++;
	// 		// getCodeWithElement(obj, res);
	// 	});
	// }
	cloudantCode.getOne(obj, numberOfElements, function (msg, data) {
		if (msg) {
			console.log(data);
			res.send(data);

		}
	});
}

// res.send(JSON.stringify(obj.data.Code));



//Api for pdf generation

exports.getPdf = function (req, res) {
	var params = req.body

	console.log("pdfparams", params);
	console.log("params end");
	var fs = require('fs');
	var filePath = '';
	var x;
	var transactionSet = params.transactionSet;
	var version = params.version;
	var transactionDescription = params.transactionDescription;
	var transactionFunctionalGroup = params.transactionFunctionalGroup;
	var headingText = params.headingText;
	var footerText = params.footerText;
	footerText = footerText.split('$');
	var businessPartnerText = params.businessPartnerText;
	var numberOfHeadingSegments = params.numberOfHeadingSegments;
	var numberOfDetailSegments = params.numberOfDetailSegments;
	var numberOfSummarySegments = params.numberOfSummarySegments;
	var presentLoop = '';

	// params.segmentUsage=params.segmentUsage.substring(1,params.segmentUsage.length-1);
	// console.log(params.segmentUsage);

	var segmentUsage = params.segmentUsage;
	var numberOfElementsInSegment = params.numberOfElementsInSegment;
	var elementUsageDefs = params.elementUsageDefs;
	var segmentText = params.segmentText;
	var elementCode = params.code;

	var doc = new pdfkit({
		size: 'a4',
		layout: 'portrait',
		margin: 50,
		bufferPages: true
	});
	var y, z, a;
	var tempElementCode = elementCode;

	var fileName = businessPartnerText + '_' + transactionSet + '_' + version + '.pdf';

	res.setHeader('Content-Type', 'application/pdf');
	res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);


	filePath = __dirname + '/pdf/' + fileName;

	for (x in tempElementCode) {
		for (y in tempElementCode[x]) {
			for (z in tempElementCode[x][y]) {
				console.log(tempElementCode[x][y][z]);
			}
		}
	}

	for (y in segmentText) {
		segmentText[y] = segmentText[y].split('$');
	}

	fs.open(filePath, 'w+', function (err, fd) {

		if (!err) {
			doc.pipe(fs.createWriteStream(filePath));
			doc.pipe(res);
			//	doc.addPage();
			//HEADING PART /////////////////////////////////////////////////////////////////////////////////////////////////////////////			
			console.log('heading');
			var maxx = 0;

			//TransactionSet and Version

			doc.font('Helvetica-Bold');
			doc.fontSize(20);
			doc.text(transactionSet, {
				lineBreak: false
			});
			if (doc.x > maxx) {
				maxx = doc.x;
			}

			doc.moveDown();
			doc.fontSize(10);
			doc.fillColor('red');
			doc.text('VER.' + version, 50, doc.y, {
				lineBreak: false
			});
			if (doc.x > maxx) {
				maxx = doc.x;
			}
			doc.font('Helvetica');

			//Heading line definition
			doc.lineWidth(2.5);
			doc.moveTo(maxx + 5, 50).lineTo(550, 50).stroke();

			//Transaction Description
			doc.fillColor('black');
			doc.fontSize(20);
			doc.font('Helvetica-Bold');
			doc.text(transactionDescription, maxx + 7, 57, {
				lineBreak: true
			});
			doc.lineWidth(2.5);
			doc.moveTo(doc.x, doc.y).lineTo(550, doc.y).stroke();


			//END HEADING PART//////////////////////////////////////////////////////////////////////////////////////////////////

			//SUMMARY OF SEGMENTS //////////////////////////////////////////////////////////////////////////////////////////////			

			console.log('segmentsummary');

			doc.fillColor('black');
			doc.font('Helvetica');
			doc.fontSize(10);
			doc.text(headingText, 50, doc.y + 20, {
				lineBreak: true
			});

			if (numberOfHeadingSegments > 0) {

				//Heading table heading
				doc.moveDown(2);
				doc.fontSize(15);
				doc.font('Helvetica-BoldOblique');
				doc.text('Heading', {
					underline: true
				});

				doc.moveDown(1);
				doc.fontSize(10);
				doc.font('Helvetica-Bold');
				doc.text('POS', {
					underline: true,
					indent: 5
				});
				doc.moveUp(1);
				doc.text('ID', {
					underline: true,
					indent: 45
				});
				doc.moveUp(1);
				doc.text('Segment Name', {
					underline: true,
					indent: 85
				});
				doc.moveUp(1);
				doc.text('Req', {
					underline: true,
					indent: 320
				});
				doc.moveUp(1);
				doc.text('Max Use', {
					underline: true,
					indent: 355
				});
				doc.moveUp(1);
				doc.text('Repeat', {
					underline: true,
					indent: 410
				});
				doc.moveUp(1);
				doc.text('Notes', {
					underline: true,
					indent: 460
				});

				doc.fontSize(10);
				doc.fillColor('#757575');

				for (x in segmentUsage) {
					if (segmentUsage[x]['Section'] == 'H') {
						if (segmentUsage[x]['LoopID'] != '' && presentLoop != segmentUsage[x]['LoopID']) {
							doc.rect(doc.x - 3, doc.y + 4, 503, 20).fillAndStroke('#0d47a1', '#0d47a1');
							presentLoop = segmentUsage[x]['LoopID']

							doc.moveDown(1);
							doc.fillColor('white');
							doc.font('Helvetica-Bold');
							doc.text('Segment Group ' + segmentUsage[x]['LoopID'] + '_' + segmentUsage[x]['SegmentID'], {
								indent: 5
							});
							doc.moveUp(1);
							doc.text('', {
								indent: 45
							});
							doc.moveUp(1);
							doc.text(' ', {
								indent: 85
							});
							doc.moveUp(1);
							doc.text(' ', {
								indent: 333
							});
							doc.moveUp(1);
							doc.text(' ', {
								indent: 368
							});
							// doc.moveUp(1);
							doc.text(segmentUsage[x]['MaximumLoopRepeat'], {
								indent: 423,
								underline: true
							});
							doc.moveUp(1);
							doc.text(' ', {
								indent: 473
							});
							doc.fillColor('#757575');
						}

						doc.moveDown(1);
						doc.font('Helvetica');
						doc.text((segmentUsage[x]['Position'] == '') ? ' ' : segmentUsage[x]['Position'], {
							indent: 5
						});
						doc.moveUp(1);
						doc.text((segmentUsage[x]['SegmentID'] == '') ? ' ' : segmentUsage[x]['SegmentID'], {
							indent: 45
						});
						doc.moveUp(1);
						doc.text((segmentUsage[x]['SegmentDescription'] == '') ? ' ' : segmentUsage[x]['Description'], {
							indent: 85
						});
						doc.moveUp(1);
						doc.text((segmentUsage[x]['RequirementDesignator'] == '') ? ' ' : segmentUsage[x]['RequirementDesignator'], {
							indent: 323
						});
						doc.moveUp(1);
						doc.text((segmentUsage[x]['MaximumUsage'] == '') ? ' ' : segmentUsage[x]['MaximumUsage'], {
							indent: 358
						});
						doc.moveUp(1);
						doc.text(' ', {
							indent: 413
						});
						doc.moveUp(1);
						doc.text(' ', {
							indent: 463
						});
						//doc.moveDown(1);						
					}
				}
			}

			if (doc.y > 600) {
				doc.addPage();
			}

			if (numberOfDetailSegments > 0) {

				//Heading table heading
				doc.moveDown(3);
				doc.fontSize(15);
				doc.fillColor('black');
				doc.font('Helvetica-BoldOblique');
				doc.text('Detail', {
					underline: true
				});

				doc.moveDown(1);
				doc.fontSize(10);
				doc.font('Helvetica-Bold');
				doc.text('POS', {
					underline: true,
					indent: 5
				});
				doc.moveUp(1);
				doc.text('ID', {
					underline: true,
					indent: 45
				});
				doc.moveUp(1);
				doc.text('Segment Name', {
					underline: true,
					indent: 85
				});
				doc.moveUp(1);
				doc.text('Req', {
					underline: true,
					indent: 320
				});
				doc.moveUp(1);
				doc.text('Max Use', {
					underline: true,
					indent: 355
				});
				doc.moveUp(1);
				doc.text('Repeat', {
					underline: true,
					indent: 410
				});
				doc.moveUp(1);
				doc.text('Notes', {
					underline: true,
					indent: 460
				});

				doc.fontSize(10);
				doc.fillColor('#757575');

				for (x in segmentUsage) {
					if (segmentUsage[x]['Section'] == 'D') {
						if (segmentUsage[x]['LoopID'] != '' && presentLoop != segmentUsage[x]['LoopID']) {
							doc.rect(doc.x - 3, doc.y + 4, 503, 20).fillAndStroke('#0d47a1', '#0d47a1');
							presentLoop = segmentUsage[x]['LoopID']

							doc.moveDown(1);
							doc.fillColor('white');
							doc.font('Helvetica-Bold');
							doc.text('Segment Group ' + segmentUsage[x]['LoopID'] + '_' + segmentUsage[x]['SegmentID'], {
								indent: 5
							});
							doc.moveUp(1);
							doc.text('', {
								indent: 45
							});
							doc.moveUp(1);
							doc.text(' ', {
								indent: 85
							});
							doc.moveUp(1);
							doc.text(' ', {
								indent: 333
							});
							doc.moveUp(1);
							doc.text(' ', {
								indent: 368
							});
							// doc.moveUp(1);
							doc.text(segmentUsage[x]['MaximumLoopRepeat'], {
								indent: 423,
								underline: true
							});
							doc.moveUp(1);
							doc.text(' ', {
								indent: 473
							});
							doc.fillColor('#757575');
						}
						doc.moveDown(1);
						doc.font('Helvetica');
						doc.text((segmentUsage[x]['Position'] == '') ? ' ' : segmentUsage[x]['Position'], {
							indent: 5
						});
						doc.moveUp(1);
						doc.text((segmentUsage[x]['SegmentID'] == '') ? ' ' : segmentUsage[x]['SegmentID'], {
							indent: 45
						});
						doc.moveUp(1);
						doc.text((segmentUsage[x]['SegmentDescription'] == '') ? ' ' : segmentUsage[x]['Description'], {
							indent: 85
						});
						doc.moveUp(1);
						doc.text((segmentUsage[x]['RequirementDesignator'] == '') ? ' ' : segmentUsage[x]['RequirementDesignator'], {
							indent: 323
						});
						doc.moveUp(1);
						doc.text((segmentUsage[x]['MaximumUsage'] == '') ? ' ' : segmentUsage[x]['MaximumUsage'], {
							indent: 358
						});
						doc.moveUp(1);
						doc.text(' ', {
							indent: 413
						});
						doc.moveUp(1);
						doc.text(' ', {
							indent: 463
						});
						//doc.moveDown(1);						
					}
				}
			}

			if (doc.y > 600) {
				doc.addPage();
			}

			if (numberOfSummarySegments > 0) {

				//Heading table heading
				doc.moveDown(3);
				doc.fontSize(15);
				doc.fillColor('black');
				doc.font('Helvetica-BoldOblique');
				doc.text('Summary', {
					underline: true
				});

				doc.moveDown(1);
				doc.fontSize(10);
				doc.font('Helvetica-Bold');
				doc.text('POS', {
					underline: true,
					indent: 5
				});
				doc.moveUp(1);
				doc.text('ID', {
					underline: true,
					indent: 45
				});
				doc.moveUp(1);
				doc.text('Segment Name', {
					underline: true,
					indent: 85
				});
				doc.moveUp(1);
				doc.text('Req', {
					underline: true,
					indent: 320
				});
				doc.moveUp(1);
				doc.text('Max Use', {
					underline: true,
					indent: 355
				});
				doc.moveUp(1);
				doc.text('Repeat', {
					underline: true,
					indent: 410
				});
				doc.moveUp(1);
				doc.text('Notes', {
					underline: true,
					indent: 460
				});

				doc.fontSize(10);
				doc.fillColor('#757575');

				for (x in segmentUsage) {
					if (segmentUsage[x]['Section'] == 'S') {
						if (segmentUsage[x]['LoopID'] != '' && presentLoop != segmentUsage[x]['LoopID']) {
							doc.rect(doc.x - 3, doc.y + 4, 503, 20).fillAndStroke('#0d47a1', '#0d47a1');
							presentLoop = segmentUsage[x]['LoopID']

							doc.moveDown(1);
							doc.fillColor('white');
							doc.font('Helvetica-Bold');
							doc.text('Segment Group ' + segmentUsage[x]['LoopID'] + '_' + segmentUsage[x]['SegmentID'], {
								indent: 5
							});
							doc.moveUp(1);
							doc.text('', {
								indent: 45
							});
							doc.moveUp(1);
							doc.text(' ', {
								indent: 85
							});
							doc.moveUp(1);
							doc.text(' ', {
								indent: 333
							});
							doc.moveUp(1);
							doc.text(' ', {
								indent: 368
							});
							// doc.moveUp(1);
							doc.text(segmentUsage[x]['MaximumLoopRepeat'], {
								indent: 423,
								underline: true
							});
							doc.moveUp(1);
							doc.text(' ', {
								indent: 473
							});
							doc.fillColor('#757575');
						}
						doc.moveDown(1);
						doc.font('Helvetica');
						doc.text((segmentUsage[x]['Position'] == '') ? ' ' : segmentUsage[x]['Position'], {
							indent: 5
						});
						doc.moveUp(1);
						doc.text((segmentUsage[x]['SegmentID'] == '') ? ' ' : segmentUsage[x]['SegmentID'], {
							indent: 45
						});
						doc.moveUp(1);
						doc.text((segmentUsage[x]['SegmentDescription'] == '') ? ' ' : segmentUsage[x]['Description'], {
							indent: 85
						});
						doc.moveUp(1);
						doc.text((segmentUsage[x]['RequirementDesignator'] == '') ? ' ' : segmentUsage[x]['RequirementDesignator'], {
							indent: 323
						});
						doc.moveUp(1);
						doc.text((segmentUsage[x]['MaximumUsage'] == '') ? ' ' : segmentUsage[x]['MaximumUsage'], {
							indent: 358
						});
						doc.moveUp(1);
						doc.text(' ', {
							indent: 413
						});
						doc.moveUp(1);
						doc.text(' ', {
							indent: 463
						});
						//doc.moveDown(1);						
					}
				}
			}

			// END OF SUMMARY OF SEGMENTS //////////////////////////////////////////////////////////////////////////////////////////////////////

			// // Footer Part ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			// 			if(doc.y>750&&footerText.length>1)
			// 			{
			// 				doc.addPage();
			// 			}

			// 			for(x in footerText)
			// 			{
			// 				if(x%2!=0)
			// 				{
			// 					doc.moveDown(2);
			// 					doc.font('Helvetica-Bold');
			// 					doc.text(footerText[x],{lineBreak:true,underline:true});
			// 				}
			// 				else
			// 				{
			// 					doc.font('Helvetica');
			// 					doc.text(footerText[x],{lineBreak:true});
			// 				}
			// 			}

			// 			//Heading text
			// 			//doc.fillColor('black');

			// //End of footer part////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			//Element Summary With Segments ///////////////////////////////////////////////////////////////////////////////////////////////////

			console.log('Elemet Summary');

			doc.moveDown(1);
			for (x in segmentUsage) {
				//Title
				doc.addPage();
				doc.fillColor('black');
				doc.font('Helvetica-Bold');
				doc.fontSize(35);
				doc.text(segmentUsage[x]['SegmentID'], {
					lineBreak: false
				});

				//Line Graphics of each page
				doc.lineWidth(1);
				var g = doc.x + 10;
				doc.moveTo(doc.x + 10, doc.y - 5).lineTo(550, doc.y - 5).stroke('#0d47a1');
				doc.rect(400, doc.y - 5, 150, 40).stroke();

				doc.fontSize(12);
				doc.text("    " + segmentUsage[x]['Description'], {
					columns: 1,
					width: 300
				});
				doc.moveUp(1);

				//Side Summary Box
				doc.font('Courier');
				doc.fontSize(10);
				doc.text('POS: ' + segmentUsage[x]['Position'], 405, doc.y);
				doc.moveUp(1);
				doc.text('Max: ' + segmentUsage[x]['MaximumUsage'], {
					align: 'right'
				});
				doc.text(((segmentUsage[x]['Section'] == 'H') ? 'Heading' : '') + ((segmentUsage[x]['Section'] == 'D') ? 'Detail' : '') + ((segmentUsage[x]['Section'] == 'S') ? 'Summary' : '') + " - " + ((segmentUsage['RequirementDesignator'] == 'M') ? 'Mandatory' : 'Optional'), 425, doc.y);
				doc.text('Loop: ' + ((segmentUsage[x]['LoopID'] == "") ? 'N/A' : segmentUsage[x]['LoopID']), 405, doc.y);
				doc.moveUp(1);
				doc.text('Elements: ' + numberOfElementsInSegment[segmentUsage[x]['Position']], {
					align: 'right'
				});

				//Table Heading
				doc.font('Helvetica-BoldOblique');
				doc.fontSize(15);
				doc.text('Element Summary', 55, 120, {
					underline: true
				});

				//Table Body
				doc.moveDown(1);
				doc.fontSize(10);
				doc.font('Helvetica-Bold');
				doc.text('Ref', {
					underline: true,
					indent: 5
				});
				doc.moveUp(1);
				doc.text('ID', {
					underline: true,
					indent: 43
				});
				doc.moveUp(1);
				doc.text('Segment Name', {
					underline: true,
					indent: 75
				});
				doc.moveUp(1);
				doc.text('Req', {
					underline: true,
					indent: 320
				});
				doc.moveUp(1);
				doc.text('Type', {
					underline: true,
					indent: 355
				});
				doc.moveUp(1);
				doc.text('Min/Max', {
					underline: true,
					indent: 410
				});
				doc.moveUp(1);
				doc.text('Notes', {
					underline: true,
					indent: 460
				});

				for (y in elementUsageDefs[segmentUsage[x]['Position']]) {
					doc.fillColor('#757575');
					doc.moveDown(1);
					doc.font('Helvetica');
					doc.text(elementUsageDefs[segmentUsage[x]['Position']][y]['SegmentID'] + elementUsageDefs[segmentUsage[x]['Position']][y]['Position'], {
						indent: 5
					});
					doc.moveUp(1);
					doc.text(elementUsageDefs[segmentUsage[x]['Position']][y]['ElementID'], {
						indent: 43
					});
					doc.moveUp(1);
					doc.text(elementUsageDefs[segmentUsage[x]['Position']][y]['Description'], {
						indent: 75
					});
					doc.moveUp(1);
					doc.text(elementUsageDefs[segmentUsage[x]['Position']][y]['RequirementDesignator'], {
						indent: 323
					});
					doc.moveUp(1);
					doc.text(elementUsageDefs[segmentUsage[x]['Position']][y]['Type'], {
						indent: 358
					});
					doc.moveUp(1);
					doc.text(elementUsageDefs[segmentUsage[x]['Position']][y]['MinimumLength'] + '/' + elementUsageDefs[segmentUsage[x]['Position']][y]['MaximumLength'], {
						indent: 413
					});
					doc.moveUp(1);
					doc.text(' ', {
						indent: 463
					});

					if (elementCode[segmentUsage[x]['Position']] != undefined && elementCode[segmentUsage[x]['Position']][elementUsageDefs[segmentUsage[x]['Position']][y]['Position']] != undefined) {
						doc.moveDown(2);
						doc.font('Helvetica-Bold');
						doc.moveUp(1);
						doc.text('Code', {
							underline: true,
							indent: 90
						});
						doc.moveUp(1);
						doc.text('Name', {
							underline: true,
							indent: 140
						});
						doc.font('Helvetica');

						for (a in elementCode[segmentUsage[x]['Position']][elementUsageDefs[segmentUsage[x]['Position']][y]['Position']]) {
							doc.text(elementCode[segmentUsage[x]['Position']][elementUsageDefs[segmentUsage[x]['Position']][y]['Position']][a]['value'], {
								indent: 90,
								lineGap: 2
							});
							doc.moveUp(1);
							doc.text(elementCode[segmentUsage[x]['Position']][elementUsageDefs[segmentUsage[x]['Position']][y]['Position']][a]['description'], {
								indent: 140,
								lineGap: 2
							});
							//	doc.moveDown(1);							
						}
					}

					//	doc.moveDown(1);										
				}

				//Segment ElementSummary Footer

				for (z in segmentText[segmentUsage[x]['Position']]) {
					if (z % 2 != 0) {
						doc.moveDown(2);
						doc.font('Helvetica-Bold');
						doc.text(segmentText[segmentUsage[x]['Position']][z], {
							lineBreak: true,
							underline: true
						});
					} else {
						doc.font('Helvetica');
						doc.text(segmentText[segmentUsage[x]['Position']][z], {
							lineBreak: true
						});
					}
				}
			}

			//End element summary with segments ///////////////////////////////////////////////////////////////////////////////////////////////


			// Footer Part ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

			console.log('finalfooter');

			doc.addPage();

			for (x in footerText) {
				if (x % 2 != 0) {
					doc.moveDown(2);
					doc.font('Helvetica-Bold');
					doc.text(footerText[x], {
						lineBreak: true,
						underline: true
					});
				} else {
					doc.font('Helvetica');
					doc.text(footerText[x], {
						lineBreak: true
					});
				}
			}

			//Heading text
			//doc.fillColor('black');

			//End of footer part////////////////////////////////////////////////////////////////////////////////////////////////////////////////



			// Add header and footer data

			console.log('page headers');

			var range = doc.bufferedPageRange();
			var i;
			for (i = range.start; i < (range.start + range.count); i++) {
				doc.switchToPage(i);
				//doc.font('Helvetica-Bold');
				doc.fontSize(12);
				doc.text(businessPartnerText, 10, 10);
			}

			console.log('end');

			// # finalize the PDF and end the stream
			doc.end()

			fs.unlink(filePath, (err) => {
				if (err) {
					console.log('Error deleting ' + filePath);
				} else {
					console.log('successfully deleted ' + filePath);
				}
			});

		} else {
			console.log(err);
			res.send('Error');
		}

	});
}

//Api for ediLog generation

exports.logEdiGuideCreation = function (req, res) {
	var log = req.body;
	log['Username'] = req.session.user;
	log['Timestamp'] = Date.now();
	cloudantEdiLog.push(JSON.stringify(log), function (success, msg) {
		if (success) {
			console.log(msg);
		} else {
			console.log(msg);
		}
	});
}

exports.getLatestVersion = function (req, res) {
	var params = req.body;
	console.log(params);
	var query = {
		"Agency": params.agency,
		"Version": params.version,
		"TransactionSet": params.transactionSet,
		"BusinessPartner": params.businessPartner,

	}


	ediLog.getMaxVersion(query, function (msg, data) {
		var obj = JSON.parse(msg);
		if (data != null && data.length > 0) {
			obj.data = data[0]['FileVersion'];
		} else {
			obj.data = [];
		}
		res.send(JSON.stringify(obj));
	});

}

exports.getEdiGuideLog = function (req, res) {
	var params = req.body;
	//Stripping spaces
	params.version = params.version.replace(' ', "[\\s]*");
	// params.user=req.session.user.replace(' ','');
	// params.businessPartner=params.businessPartner.replace(' ','');
	// params.transactionSet=params.transactionSet.replace(' ','');

	console.log('filters');
	var filterFrom = new Date(params.from);
	console.log(filterFrom);
	filterFrom = filterFrom.getTime() + (24 * 60 * 60 * 1000);
	var filterTo = new Date(params.to);
	console.log(filterTo);
	filterTo = filterTo.getTime() + (24 * 60 * 60 * 1000);

	if (req.session.user) {
		if (req.session) {
			// if(req.session.privilege==1)
			// {
			// 	var query={
			// 		"Username" : params.user,
			// 		"BusinessPartner" : new RegExp(params.businessPartner, "i"),
			// 		"TransactionSet" : new RegExp(params.transactionSet,"i"),
			// 		"Version" : new RegExp(params.version,"i"),
			// 		"Timestamp" : { $gt : filterFrom, $lt : filterTo }		
			// 	};
			// }
			// else if(req.session.privilege==0){
			var query = {
				"Username": new RegExp(params.createdBy, "i"),
				"FileType": params.fileType,
				"BusinessPartner": new RegExp(params.businessPartner, "i"),
				"TransactionSet": new RegExp(params.transactionSet, "i"),
				"Version": new RegExp(params.version, "i"),
				"Timestamp": {
					$gt: filterFrom,
					$lt: filterTo
				}
			};
			// }

			console.log(query);

			ediLog.get(query, function (msg, data) {
				var obj = JSON.parse(msg);
				obj.data = data;
				res.send(JSON.stringify(obj));
			});
		} else {
			res.send({
				status: false,
				message: 'Unauthorised'
			});
		}
	} else {
		res.send({
			status: false,
			message: 'Unauthorised'
		});
	}
}

exports.getReport = function (req, res) {
	var x;
	var params = req.body;
	var attribute = params.attribute;
	var filterFrom = new Date(params.from);
	var filterTo = new Date(params.to);
	var result = {};
	var chartify = [];

	filterFrom = filterFrom.getTime() - (24 * 60 * 60 * 1000);
	filterTo = filterTo.getTime() + (24 * 60 * 60 * 1000);

	var query = {
		"FileType": params.fileType,
		"Timestamp": {
			$gt: filterFrom,
			$lt: filterTo
		}
	};

	ediLog.get(query, function (msg, data) {
		var obj = JSON.parse(msg);

		console.log(data);

		if (obj.status == true) {
			if (data == undefined) {
				data = [];
			}
			obj.numberOfLogs = data.length;
			for (x in data) {
				if (result[data[x][attribute]] != undefined) {
					result[data[x][attribute]]++;
				} else {
					result[data[x][attribute]] = 1;
				}
			}
			for (x in result) {
				chartify.push([x, result[x]])
			}

			obj.data = chartify;
			console.log(chartify);
		}

		res.send(JSON.stringify(obj));
	});
}

//Api for drafts

exports.createDraft = function (req, res) {

	var draft = req.body;

	draft['Username'] = req.session.user;

	console.log(draft);

	ediDraft.create(draft, function (str) {
		console.log(str);
		res.send(str);
	});

}

exports.getDraft = function (req, res) {

	console.log(req.body);

	var query = {
		'Username': req.session.user,
		'FileType': req.body.fileType
	};

	ediDraft.get(query, function (msg, data) {

		console.log(msg);
		console.log(data);

		var obj = JSON.parse(msg);
		obj.data = data;

		res.send(JSON.stringify(obj));

		ediDraft.remove(query, function (msg, data) {
			// console.log(msg);
			// console.log(data);
		});

	});
}