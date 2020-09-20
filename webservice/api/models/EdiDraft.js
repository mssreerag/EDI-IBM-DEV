var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var ObjectId = Schema.ObjectId;

var EdiDraftSchema = new Schema({
	"Username" : { type : String },
	"Progress" : { type : Number },
	"FileType" : { type : Number },	// 0 - ediSpec 1-ediFile
	"FileVersion" : { type : Number },	// future
	"BusinessPartner" : { type : String },
	"Agency" : { type : String },
	"Version" : { type : String },
	"TransactionSet" : { type : String },
	"SegmentPosition" : { type : String },
	"SegmentID" : { type : String },
	"ElementUsageDefs" : { type : String },
	"ElementUsageValue" : { type : String },
	"ElementUsageGroups" : { type : String },
	"Code" : { type : String },
	"Header" : { type : String },
	"Footer" : { type : String },
	"SegmentFooter" : { type : String },
	//Edi file specific values
	"SegmentDelimiter" : { type : String },
	"ElementDelimiter" : { type : String },
	"SubElementDelimiter" : { type : String },
},{
	collection : "EdiDraft"
});

module.exports = mongoose.model('EdiDraft',EdiDraftSchema);