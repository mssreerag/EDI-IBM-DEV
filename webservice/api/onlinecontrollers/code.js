'use strict';
const Cloudant = require('@cloudant/cloudant');
const {
    query
} = require('express');
const vcap = require('../CloudantApi/vcap_local.json');
var Code = require('../models/Code.js');
var genRes = require('./genres.js');
var _ = require('underscore');
var dbname = "code"

var dbase;

exports.get = function (searchQuery, callback) {
    dbase.find(searchQuery, (err, documents) => {
        if (err) {
            console.log(err);
            throw err;

        } 
        console.log(dbname);
        var code = documents.docs
        console.log("code recieved from db", code);
        // var response = genRes.generateResponse(true, "found successfully");
        // callback(response, code);
        if (_.isNull(err) && code.length > 0) {
            var response = genRes.generateResponse(true, "found successfully");
            callback(response, code);
        } else if (code == undefined) {
            var response = genRes.generateResponse(true, "No Code found null");
            callback(response, null);
        } else if (code.length == 0) {
            var response = genRes.generateResponse(true, "No Code found");
            callback(response, null);
        } else {
            var response = genRes.generateResponse(false, "there occured some error : " + err);
            callback(response, null);
        }

    });
}

exports.getOne = function (obj, numberOfElements, callback) {

    for (var i = 0; i < numberOfElements; i++) {
        console.log(i);
        obj.data[i]['Code'] = "";
        var params = obj.data[i];
        var query = {
            "selector": {
                "Agency": params['Agency'],
                "Version": params['Version'],
                "ElementID": params['ElementID']
            }
        };
        //		code.getOne(query, function (msg, data) {

        dbase.find(query, (err, documents) => {
            // console.log(documents.docs);
            var code = documents.docs
            // var response = genRes.generateResponse(true, "found successfully");
            // callback(response, code);
            if (_.isNull(err) && code.length > 0) {
                console.log("data");
                if (data != null) {
                    obj.data[i]['Code'] = JSON.parse(code);
                }
            } else if (code == undefined) {
                console.log("undefined");
                // callback(response, null);
            } else if (code.length == 0) {
                console.log("no code found");
            } else {
                var response = genRes.generateResponse(false, "there occured some error : " + err);
                console.log("NO CONNECTION OR SOMETNG");
            }

        });
        //console.log(msg["message"]);
        // console.log(obj.data[numberOfElementsRetrieved]['Code']);
        // obj.data[numberOfElementsRetrieved]['code']=msg.status;
        // numberOfElementsRetrieved++;
        // getCodeWithElement(obj, res);


    }
    callback(true, obj);


}


exports.get = function (params, callback) {
    Code
        .findOne(params)
        .exec(function (err, code) {
            if (_.isNull(err) && code == null) {
                var response = genRes.generateResponse(false, "No record");
                callback(response, code);
            } else if (_.isNull(err) && code != null) {
                var response = genRes.generateResponse(true, "found successfully");
                callback(response, code);
            } else {
                var response = genRes.generateResponse(false, "there occured some error : " + err);
                callback(response, null);
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
                test();
            }
        }));
    }).catch(

        console.log("HOLY MOLY.."));
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

function test(){
dbase.find({
    "selector":{
       "_id": "081fc7f9124797334b2f976b010016df"
}
 }, (err, documents) => {console.log("TESTTT",documents);

    
})}