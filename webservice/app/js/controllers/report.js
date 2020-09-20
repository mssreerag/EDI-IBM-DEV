'use strict';

angular.module('ediCreatorApp')

.controller('ReportCtrl', ['$rootScope','$scope','customHttp','$location',function ($rootScope,$scope,customHttp,$location){	
    
    $scope.searchIn="0";
    $scope.loading=false;
    $scope.filterFrom=new Date("Tue Mar 1 2016");
    $scope.filterTo=new Date(new Date().getTime());
	$scope.today=$scope.filterTo.getFullYear()+"-"+((($scope.filterTo.getMonth()+1)>=10)?($scope.filterTo.getMonth()+1):('0'+($scope.filterTo.getMonth()+1)))+"-"+(($scope.filterTo.getDate()>=10)?$scope.filterTo.getDate():('0'+$scope.filterTo.getDate()));
	$scope.filterTo=new Date();
	$scope.reportAttribute='Agency';
	$scope.agency={};

	$scope.displayFilterTo='';
	$scope.displayFilterFrom='';
	$scope.displayDomain='';
	$scope.displayFileType='';
	$scope.numberOfLogs=0;

 	$scope.pieChartData = [];

	$scope.barChartData = [
                {
                    "key": "Series 1",
                    "values": [ ]
                }
             ];

	var maxDate=$scope.filterTo;
	var minDate=$scope.filterFrom;
	var fromPicker;
	var toPicker;

	$(document).ready( function(){

		var fromDate=0;

		console.log('Ready');
		fromDate=$scope.filterTo-(7 * 24 * 60 * 60 * 1000);
		$scope.filterFrom=new Date(fromDate);

		// $('.datepicker').eq(0).pikaday({ minDate : minDate ,maxDate: maxDate,defaultDate:$scope.filterFrom,setDefaultDate:true});	
		// $('.datepicker').eq(1).pikaday({ minDate : minDate,maxDate: maxDate,defaultDate:$scope.filterTo,setDefaultDate:true});

		fromPicker = new Pikaday({ field: document.getElementsByClassName('datepicker')[0] , minDate : minDate ,maxDate: maxDate,defaultDate:$scope.filterFrom,setDefaultDate:true });			
		toPicker = new Pikaday({ field: document.getElementsByClassName('datepicker')[1],minDate : minDate,maxDate: maxDate,defaultDate:$scope.filterTo,setDefaultDate:true });

		$scope.filterFrom=$scope.filterFrom.toString().substring(0,15);
		$scope.filterTo=$scope.filterTo.toString().substring(0,15);
			
	});


	customHttp.request('','/api/agency/getAll','POST',function(data){
		var x;
		console.log(data);
		if(data.status==true)
		{
			for(x in data.data)
			{
				$scope.agency[data.data[x]['Agency']]=data.data[x]['Description'];
			}
		}
		else
		{
			console.log("Error in fetching agencies");
		}
	});

	$scope.dateValidator = function(x){

		var a=new Date($scope.filterFrom);
		var b=new Date($scope.filterTo);

		// $('.datepicker').eq(0).pikaday({ minDate : minDate ,maxDate: b,defaultDate:a,setDefaultDate:true});	
		// $('.datepicker').eq(1).pikaday({ minDate : a ,maxDate: maxDate,defaultDate:b,setDefaultDate:true});		

		// console.log(a);
		// console.log(b);
		// console.log(a < b);

		if(!(a<b))
		{
			if(x==0)
			{
				fromPicker.setDate(b);
				$scope.filterFrom=b.toString().substring(0,15);
			}
			else
			{
				toPicker.setDate(a);
				$scope.filterTo=a.toString().substring(0,15);
			}
		}

	}

	$scope.xAxisTickFormatFunction = function(){
	    return function(d){
            // return d3.time.format('%b')(new Date(d));

	    	if($scope.displayDomain=='Agency')
	    	{
	    		return $scope.agency[d[0][0]];
	    	}

            if(d.split)
            	d=d.split('@');
            return d[0];
	    }
	}

	$scope.xFunction = function(){
	    return function(d) {

	    	if($scope.displayDomain=='Agency')
	    	{
	    		return $scope.agency[d[0][0]];
	    	}

	    	//console.log(d);
	    	console.log(d[0]);
	    	if(d[0].split)
	    	{
	    		d[0]=d[0].split('@');
	        	return d[0][0];
	        }
	        else{
	        	return d[0][0];	
	        }

	    };
	}

	$scope.yFunction = function(){
	    return function(d) {
	        return d[1];
	    };
	}	

	$scope.getReport = function(){
		var params="from="+$scope.filterFrom+"&to="+$scope.filterTo;
		params=params+"&attribute="+$scope.reportAttribute;
		params=params+"&fileType="+$scope.searchIn;
		// params=params+"&attribute=BusinessPartner";

		$scope.loading=true;

		customHttp.request(params,'/api/report/get','POST',function(data){
			
			if(data.status==true)
			{
				$scope.barChartData = [
                 {
                     "key": "Series 1",
                     "values": data.data
                 }
             	];

             	$scope.pieChartData=data.data;
             	$scope.displayFilterFrom=$scope.filterFrom;
             	$scope.displayFilterTo=$scope.filterTo;
             	$scope.displayDomain=$scope.reportAttribute;
             	$scope.displayFileType=($scope.searchIn==0)?'Edi Spec':'Edi File';
             	$scope.numberOfLogs=data.numberOfLogs;
             	$scope.loading=false;
			}
			else
			{
				$scope.loading=false;
			}
		});
	}

	$scope.getReport();

	$scope.print = function(){
		window.print();
	}

	$scope.prev = function (){
		$location.path('/home');
	}
}])
