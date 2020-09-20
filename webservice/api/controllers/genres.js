//Generate Response JS
exports.generateResponse = function(status,message){
	var response = {
		status : status,
		message : message
	}
	return JSON.stringify(response);
}