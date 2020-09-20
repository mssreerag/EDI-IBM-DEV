var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var ObjectId = Schema.ObjectId;

var ElementUsageDefsSchema = new Schema({
	"GroupReqDesignator" : {type : String},
	"SegmentID" : { type : String },
	"RequirementDesignator" : { type : String },
	"Rules" : { type : String },
	"RepeatFactor" : { type : String },
	"Agency" : { type : String },
	"GroupBeginEnd" : { type : String },
	"Description" : { type : String },
	"MaximumLength" : { type : String },
	"Version" : { type : String },
	"CodeParts" : { type : String },
	"CompositeElement" : { type : String },
	"Release" : { type : String },
	"Position" : { type : String },
	"SubElementReqDesignator" : { type : String },
	"Type" : { type : String },
	"MinimumLength" : { type : String },
	"ElementID" : { type : String },
	"GroupRequirementDesignatorID" : { type : String }

},{
	collection : "ElementUsageDefs"
});

module.exports = mongoose.model('ElementUsageDefs',ElementUsageDefsSchema);