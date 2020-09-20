var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var ObjectId = Schema.ObjectId;

var AgencySchema = new Schema({
	
	"SegmentID" : { type :String },
	"RequirementDesignator" : { type : String },
	"MaximumLoopRepeat" : { type : String },
	"Section" : { type : String },
	"Agency" : { type : String },
	"MaximumUsage" : { type : String },
	"Version" : { type : String },
	"BeginEnd" : { type : String },
	"TransactionSetID" : { type : String },
	"Release" : { type : String },
	"Position" : { type : String },
	"LoopID" : { type : String },
	"RequiredFirstSegment" : { type : String }

},{
	collection : "SegmentUsage"
});

module.exports = mongoose.model('SegmentUsage',AgencySchema);