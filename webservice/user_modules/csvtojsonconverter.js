'use strict';
var fs = require('fs');

exports.convert = function (path,encoding,callback){

	fs.readFile(path,encoding,function(err,data){

		if(err)
		{
			console.log("csvtojsonconverter : "+err);
			callback(true,null);
		}
		else
		{
			data=data.split("\r\n");
			var res=[];
			var header=data[0].split(",");

			for(var j=0;j<header.length;j++)
			{
				header[j]=header[j].replace('"',"");
				header[j]=header[j].replace('"',"");
			}

			for(var i=1;i<data.length;i++)
			{
				res[i-1]={};
				var temp=data[i].split(",");
				
				for(var j=0;j<temp.length;j++)
				{
					res[i-1][header[j]]=temp[j];
					res[i-1][header[j]]=res[i-1][header[j]].replace('"',"");
					res[i-1][header[j]]=res[i-1][header[j]].replace('"',"");
				}

			} 

		//	console.log(res);
			callback(false,res);
		}

	});

}