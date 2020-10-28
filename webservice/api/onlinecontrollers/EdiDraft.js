
'use strict';

const Cloudant = require('@cloudant/cloudant');
const { json } = require('body-parser');
const {
    query
} = require('express');
const vcap = require('../CloudantApi/vcap_local.json');
var genRes = require('./genres.js');
var EdiDraft = require('../models/EdiDraft.js');

var dbname = "edi_draft";
let dbase;

exports.create = function(params,callback){
console.log("hiiieeee");	var ediDraft = new EdiDraft(params);
	console.log(ediDraft);

    dbase.insert(ediDraft,function(err,ediDraft){
		if( !(_.isNull(err)) ){
			var response_string = genRes.generateResponse(false , "There occured some error : "+err.err);
            console.log(response_string);		
            callback(response_string);
		}
		else{
            var response_string = genRes.generateResponse(true,"Draft created successfully");	
            console.log(response_string);		
			callback(response_string);
		}
	})
}
exports.get = function (params,callback){
	console.log('controller params');
	console.log(params);
	dbase
	.find(params,function(err,ediDraft)
	{
		if( _.isNull(err)&&ediDraft!=undefined&& ediDraft.length > 0 ){
			var response = genRes.generateResponse(true,"found successfully");
			callback(response,ediDraft);
		}
		else if( ediDraft==undefined||ediDraft.length == 0 ){
			var response = genRes.generateResponse(true,"No EdiDraft found");
			callback(response,null);
		}
		else{
			var response = genRes.generateResponse(false,"there occured some error : "+err);
			callback(response,null);}
	});
}

exports.get = function (searchQuery, callback) {
    dbase.find(searchQuery, (err, documents) => {
        if (err) {
            console.log(err);
            throw err;
        } else {
            console.log(dbname);
            var description = documents.docs
            // console.log(description);
            var response = genRes.generateResponse(true, "found successfully");
            callback(response, description);
        }
    });
}

exports.remove = function (params,callback){

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