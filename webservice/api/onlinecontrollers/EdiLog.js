'use strict';
const Cloudant = require('@cloudant/cloudant');
const vcap = require('../CloudantApi/vcap_local.json');
var genRes = require('./genres.js');
var _ = require('underscore');
var dbname = "edi_log"
var dbase;


exports.push = function (query, callback) {
dbase.insert(query, (err, result) => {
    console.log(JSON.parse(query));
    if (err) {
        var response_string = genRes.generateResponse(false , "There occured some error : "+err);
        callback(false,response_string);
    } else {
        var response_string = genRes.generateResponse(true,"Log created successfully"+result);			
        callback(true,response_string);
    }
});
}


function dbCloudantConnect() {
    return new Promise((resolve, reject) => {
        Cloudant({ // eslint-disable-line
            url: vcap.services.cloudantNoSQLDB.credentials.url
        }, ((err, cloudant) => {
            if (err) {
                console.log('Connect failure: ' + err.message + ' for Cloudant DB: ' +
                    dbname);
                reject(err);
            } else {
                dbase = cloudant.use(dbname);
                console.log('Connect success! Connected to DB: ' + dbname);
                resolve(dbase);
            }
        }));
    }).catch(

        console.log("HOLY MOLY log.."));
}

// Initialize the DB when this module is loaded
(function getDbConnection() {
    dbCloudantConnect().then((database) => {
        console.log('Cloudant connection initialized');
        dbase = database;

    }).catch((err) => {
        console.log('Error while initializing DB: ' + err.message, 'items-dao-cloudant.getDbConnection()');
        throw err;

    });
})();