'use strict';

var EdiDraft = require('../models/EdiDraft.js');
var genRes = require('./genres.js');
var _ = require('underscore');

exports.create = function(params,callback){
	console.log(params);
	var ediDraft = new EdiDraft(params);
	ediDraft.save(function(err,ediDraft){
		if( !(_.isNull(err)) ){
			var response_string = genRes.generateResponse(false , "There occured some error : "+err.err);
			callback(response_string);
		}
		else{
			var response_string = genRes.generateResponse(true,"Draft created successfully");			
			callback(response_string);
		}
	})
}

exports.get = function (params,callback){
	console.log('controller params');
	console.log(params);
	EdiDraft
	.find(params)
	.exec(function(err,ediDraft)
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
			callback(response,null);
		}
	});
}

exports.remove = function (params,callback){
	console.log('controller params');
	console.log(params);
	EdiDraft
	.find(params)
	.remove()
	.exec(function(err,ediDraft)
	{
		if( _.isNull(err)&&ediDraft!=undefined&& ediDraft.length > 0 ){
			var response = genRes.generateResponse(true,"reoved successfully");
			callback(response,ediDraft);
		}
		else if( ediDraft==undefined||ediDraft.length == 0 ){
			var response = genRes.generateResponse(true,"No EdiDraft found");
			callback(response,null);
		}
		else{
			var response = genRes.generateResponse(false,"there occured some error : "+err);
			callback(response,null);
		}
	});
}
