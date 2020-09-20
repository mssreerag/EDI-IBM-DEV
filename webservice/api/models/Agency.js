var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var ObjectId = Schema.ObjectId;

var AgencySchema = new Schema({
	"Agency" : { type : String },
	"Description" : { type : String },
	"EDIAgencyID" : { type : String },
	"TransactionSetAgency" : { type : String },
	"SegmentAgency" : { type : String },
	"ElementAgency" : { type : String },
	"CodeAgency" : { type : String }
},{
	collection : "Agency"
});

module.exports = mongoose.model('Agency',AgencySchema);