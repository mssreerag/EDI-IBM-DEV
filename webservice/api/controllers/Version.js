'use strict';

var Version = require('../models/Version.js');
var genRes = require('./genres.js');
var _ = require('underscore');

exports.get = function (params,callback){
	Version
	.find(params)
	.exec(function(err,version)
	{
		if( _.isNull(err) && version.length > 0 ){
			var response = genRes.generateResponse(true,"found successfully");
			callback(response,version);
		}
		else if( version == null || version.length == 0 ){
			var response = genRes.generateResponse(true,"No Version found");
			callback(response,null);
		}
		else{
			var response = genRes.generateResponse(false,"there occured some error : "+err);
			callback(response,null);
		}
	});

}