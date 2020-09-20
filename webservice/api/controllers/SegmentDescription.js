'use strict';

var SegmentDescription = require('../models/SegmentDescription.js');
var genRes = require('./genres.js');
var _ = require('underscore');

exports.get = function (params,callback){
	SegmentDescription
	.find(params)
	.exec(function(err,segmentDescription)
	{
		if(segmentDescription.length > 0 ){
			var response = genRes.generateResponse(true,"found successfully");
			callback(response,segmentDescription);
		}
		else if( segmentDescription.length == 0 ){
			var response = genRes.generateResponse(true,"No SegmentDescription found");
			callback(response,null);
		}
		else{
			var response = genRes.generateResponse(false,"there occured some error : "+err);
			callback(response,null);
		}
	});

}