'use strict';

var ElementUsageDefs = require('../models/ElementUsageDefs.js');
var genRes = require('./genres.js');
var _ = require('underscore');

exports.get = function (params,callback){
	ElementUsageDefs
	.find(params)
	.exec(function(err,elementUsageDefs)
	{
		if( _.isNull(err) && elementUsageDefs.length > 0 ){
			var response = genRes.generateResponse(true,"found successfully");
			callback(response,elementUsageDefs);
		}
		else if( elementUsageDefs.length == 0 ){
			var response = genRes.generateResponse(true,"No ElementUsageDefs found");
			callback(response,null);
		}
		else{
			var response = genRes.generateResponse(false,"there occured some error : "+err);
			callback(response,null);
		}
	});
}

exports.getOne = function(params,callback){
	ElementUsageDefs
	.findOne(params)
	.exec(function(err,code)
	{
		if( _.isNull(err) && code== null)
		{
			var response = genRes.generateResponse(false,"No record");
			callback(response,code);
		}else if( _.isNull(err) &&code!=null ){
			var response = genRes.generateResponse(true,"found successfully");
			callback(response,code);
		}
		else{
			var response = genRes.generateResponse(false,"there occured some error : "+err);
			callback(response,null);
		}
	});
}

exports.getWithCode = function (params,callback){
	ElementUsageDefs
	.find(params)
	.lean()
	.exec(function(err,elementUsageDefs)
	{
		if( _.isNull(err) && elementUsageDefs.length > 0 ){
			var response = genRes.generateResponse(true,"found successfully");
			callback(response,elementUsageDefs);
		}
		else if( elementUsageDefs.length == 0 ){
			var response = genRes.generateResponse(true,"No ElementUsageDefs found");
			callback(response,null);
		}
		else{
			var response = genRes.generateResponse(false,"there occured some error : "+err);
			callback(response,null);
		}
	});
}
