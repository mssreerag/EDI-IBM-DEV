'use strict';

var EdiLog = require('../models/EdiLog.js');
var genRes = require('./genres.js');
var _ = require('underscore');

exports.create = function(params,callback){
	console.log(params);
	var ediLog = new EdiLog(params);
	ediLog.save(function(err,ediLog){
		if( !(_.isNull(err)) ){
			var response_string = genRes.generateResponse(false , "There occured some error : "+err.err);
			callback(response_string);
		}
		else{
			var response_string = genRes.generateResponse(true,"Log created successfully");			
			callback(response_string);
		}
	})
}

exports.get = function (params,callback){
	console.log('controller params');
	console.log(params);
	EdiLog
	.find(params)
	.exec(function(err,ediLog)
	{
		if( _.isNull(err)&&ediLog!=undefined&& ediLog.length > 0 ){
			var response = genRes.generateResponse(true,"found successfully");
			callback(response,ediLog);
		}
		else if( ediLog==undefined||ediLog.length == 0 ){
			var response = genRes.generateResponse(true,"No EdiLog found");
			callback(response,null);
		}
		else{
			var response = genRes.generateResponse(false,"there occured some error : "+err);
			callback(response,null);
		}
	});
}

exports.getMaxVersion = function (params,callback){
	console.log('controller params');
	console.log(params);
	EdiLog
	.find(params)
	.sort('-FileVersion')
	.exec(function(err,ediLog)
	{
		if( _.isNull(err)&&ediLog!=undefined&& ediLog.length > 0 ){
			var response = genRes.generateResponse(true,"found successfully");
			callback(response,ediLog);
		}
		else if( ediLog==undefined||ediLog.length == 0 ){
			var response = genRes.generateResponse(true,"No EdiLog found");
			callback(response,null);
		}
		else{
			var response = genRes.generateResponse(false,"there occured some error : "+err);
			callback(response,null);
		}
	});
}