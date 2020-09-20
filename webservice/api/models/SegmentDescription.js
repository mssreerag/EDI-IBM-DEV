var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var ObjectId = Schema.ObjectId;

var SegmentDescriptionSchema = new Schema({
	"SegmentID" : {type : String},
	"Agency" : {type : String},
	"Version" : {type : String},
	"Release" : {type : String},
	"Description" : {type : String}
},{
	collection : "SegmentDescription"
});

module.exports = mongoose.model('SegmentDescription',SegmentDescriptionSchema);