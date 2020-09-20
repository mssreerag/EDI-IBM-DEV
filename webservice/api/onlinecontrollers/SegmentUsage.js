'use strict';

const Cloudant = require('@cloudant/cloudant');
const {
    query
} = require('express');
const vcap = require('../CloudantApi/vcap_local.json');
var genRes = require('./genres.js');

var dbname = "segment_usage"
exports.get = function (searchQuery, callback) {
    dbase.find(searchQuery, (err, documents) => {
        if (err) {
            console.log(err);
            throw err;
        } else {
            console.log(dbname);
            var version = documents.docs
            // console.log(version);
            var response = genRes.generateResponse(true, "found successfully");
            callback(response, version);
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
                let db = cloudant.use(dbname);
                console.log('Connect success! Connected to DB: ' + dbname);
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

    }).catch((err) => {
        console.log('Error while initializing DB: ' + err.message, 'items-dao-cloudant.getDbConnection()');
        throw err;

    });
})();