'use strict';

angular.module('ediCreatorApp')
.service('fileUpload', ['$http', function ($http) {
    this.upload = function(file, uploadUrl, lab_id, pharmacy_id, callback){
        if(file == undefined){
            console.log('File undefined');
        }
        var formdata = new FormData();
        formdata.append('file', file);
        if(lab_id){formdata.append('lab_id', lab_id);}
        if(pharmacy_id){formdata.append('pharmacy_id', pharmacy_id);}
        console.log(file);
        console.log(formdata);

        $http.post(uploadUrl, formdata, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        })
        .success(function(data){
            callback(data);
        })
        .error(function(){
            var content = {'header':'Error','message':'Error in Connection.'};
        });
    }
}])