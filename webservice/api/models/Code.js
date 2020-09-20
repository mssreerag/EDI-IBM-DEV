var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var ObjectId = Schema.ObjectId;

var CodeSchema = new Schema({
	Agency : { type : String  },
	Version : { type : String },
	ElementID : { type : String },
	Value : { type : String },
	Description : { type : String },
	Release : { type : String },
	CodePart : { type : String } 
},{
	collection : "Code"
});

module.exports = mongoose.model('Code',CodeSchema);