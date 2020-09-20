'use strict';

var Agency = require('../models/Agency.js');
var genRes = require('./genres.js');
var _ = require('underscore');

exports.get = function (params,callback){
	Agency
	.find(params)
	.exec(function(err,agency)
	{
		if( _.isNull(err) && agency.length > 0 ){
			var response = genRes.generateResponse(true,"found successfully");
			callback(response,agency);
		}
		else if( agency.length == 0 ){
			var response = genRes.generateResponse(true,"No Agency found");
			callback(response,null);
		}
		else{
			var response = genRes.generateResponse(false,"there occured some error : "+err);
			callback(response,null);
		}
	});

	

}





