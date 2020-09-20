'use strict';

var TransactionSet = require('../models/TransactionSet.js');
var genRes = require('./genres.js');
var _ = require('underscore');

exports.get = function (params,callback){
	TransactionSet
	.find(params)
	.exec(function(err,transactionSet)
	{
		if( _.isNull(err) && transactionSet.length > 0 ){
			var response = genRes.generateResponse(true,"found successfully");
			callback(response,transactionSet);
		}
		else if( transactionSet.length == 0 ){
			var response = genRes.generateResponse(true,"No TransactionSet found");
			callback(response,null);
		}
		else{
			var response = genRes.generateResponse(false,"there occured some error : "+err);
			callback(response,null);
		}
	});

}