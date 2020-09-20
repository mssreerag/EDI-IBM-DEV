// For Direct uploading of file on cloudinary. Not for use now but maybe used sometime else. 
// Note:- Did not work on May 24. Run by Akash Deep Singhal (@akigupta131)

'use strict';

angular.module('ediCreatorApp')
.service('uploadFile', ['$http', function ($http) {

    this.upload = function(impParams, requestLink, type, callback){
    	var cloud_name = 'medd';
	    $http({
	        method : type,
	        url : 'https://api.cloudinary.com/v1_1/' + cloud_name + '/image/upload',
	        data : impParams,
	        headers : {
	        	"Content-Type": undefined,
	        	'X-Requested-With': "XMLHttpRequest"
	    	}
	    })
	    .success(function(data, status, headers, config){ 	
	        callback(data);
	    })
	    .error(function(data, status, headers, config) {
	    	console.log('Error in connection!')
  		});
    }

    this.direct = function(impParams, requestLink, type, callback){
		// var file = /* your file */;
		var cloud_name = 'medd';

		var fd = new FormData();

		fd.append('upload_preset', 'seller');
		fd.append('file', file);

		$http
		    .post('https://api.cloudinary.com/v1_1/medd/image/upload', fd, {
		        headers: {
		            'Content-Type': undefined,
		            'X-Requested-With': 'XMLHttpRequest'
		        }
		    })
		    .success(function (cloudinaryResponse) {
		    	// callback(data);
		    	res.send(cloudinaryResponse);
		        // do stuff with cloudinary response
		        // cloudinaryResponse = { public_id: ..., etc. }

		    })
		    .error(function (reponse) {
		    	res.send(reponse);

		    });
    }
}])