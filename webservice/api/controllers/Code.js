'use strict';

var Code = require('../models/Code.js');
var genRes = require('./genres.js');
var _ = require('underscore');

exports.get = function (params,callback){
	Code
	.find(params)
	.select({'ElementID':1,'Value':1,'Description':1,'_id':0})
	.exec(function(err,code)
	{
		console.log(err,code);
		if( _.isNull(err) && code.length > 0 ){
			var response = genRes.generateResponse(true,"found successfully");
			callback(response,code);
		}
		else if( code == undefined ){
			var response = genRes.generateResponse(true,"No Code found null");
			callback(response,null);
		}
		else if(code.length !=0 )
		{
			var response = genRes.generateResponse(true,"No Code found");
			callback(response,null);	
		}else{
			var response = genRes.generateResponse(false,"there occured some error : "+err);
			callback(response,null);
		}
	});
}

exports.getOne = function(params,callback){
	Code
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