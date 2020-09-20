'use strict';

const Cloudant = require('@cloudant/cloudant');
const { query } = require('express');
const vcap = require('../CloudantApi/vcap_local.json');
var genRes = require('./genres.js');


exports.get=function (searchQuery,callback) {
        dbase.find(
            // {
            //     "selector": {
            //           "Agency":"X"
            //  } }
        searchQuery   
        , (err, documents) => {
            if (err) {
				console.log(err);
                throw err;

            } else {
				console.log("agency");
				var agency = documents.docs
                console.log(agency);
                var response = genRes.generateResponse(true,"found successfully");
                callback(response,agency);
            }
        });
}



function dbCloudantConnect() {
    return new Promise((resolve, reject) => {
        Cloudant({  // eslint-disable-line
            url: vcap.services.cloudantNoSQLDB.credentials.url
        }, ((err, cloudant) => {
            if (err) {
                console.log('Connect failure: ' + err.message + ' for Cloudant DB: ' +
                    "agency");
                reject(err);
            } else {
                let db = cloudant.use("agency");
                console.log('Connect success! Connected to DB: ' + "agency");
                resolve(db);
            }
        }));
    }).catch(
		
		console.log("HOLY MOLY.."));
}
let dbase;

// Initialize the DB when this module is loaded
(function getDbConnection() {
    dbCloudantConnect().then((database) => {
        console.log('Cloudant connection initialized');
		dbase = database;
		// dbase = cloudant.use("agency");

    }).catch((err) => {
        console.log('Error while initializing DB: ' + err.message, 'items-dao-cloudant.getDbConnection()');
		throw err;
		
    });
})();
