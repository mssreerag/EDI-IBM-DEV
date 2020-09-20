var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var ObjectId = Schema.ObjectId;

var TransactionSetSchema = new Schema({
	Agency : { type : String },
	Version : { type :String },
	TransactionSet : { type : String },
	FunctionalGroupID : { type : String },
	Description : { type : String },
	Release : { type : String }
},{
	collection : "TransactionSet"
});

module.exports = mongoose.model('TransactionSet',TransactionSetSchema);