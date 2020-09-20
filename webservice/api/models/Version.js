var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var ObjectId = Schema.ObjectId;

var VersionSchema = new Schema({
	 Agency : { type : String },
	 Version : { type : String },
	 Description : { type : String },
	 TransactionGrouping : { type : String }
},{
	collection : "Version"
});

module.exports = mongoose.model('Version',VersionSchema);