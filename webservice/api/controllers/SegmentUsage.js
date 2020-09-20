'use strict';

var SegmentUsage = require('../models/SegmentUsage.js');
var genRes = require('./genres.js');
var _ = require('underscore');

exports.get = function (params,callback){
	SegmentUsage
	.find(params)
	.exec(function(err,segmentUsage)
	{
		if( _.isNull(err) && segmentUsage.length > 0 ){
			var response = genRes.generateResponse(true,"found successfully");
			segmentUsage.Description="";
			callback(response,segmentUsage);
		}
		else if( segmentUsage.length == 0 ){
			var response = genRes.generateResponse(true,"No SegmentUsage found");
			callback(response,null);
		}
		else{
			var response = genRes.generateResponse(false,"there occured some error : "+err);
			callback(response,null);
		}
	});

}