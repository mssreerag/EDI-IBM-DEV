'use strict';

angular.module('ediCreatorApp')

.controller('SearchCtrl', ['$rootScope','$scope','customHttp','$location','$window',function ($rootScope,$scope,customHttp,$location,$window){	
	
	$scope.businessPartner='';
	$scope.version='';
	$scope.transactionSet='';
	$scope.createdBy='';
	$scope.history={};
	$scope.presentPage=0;
	$scope.totalRecords=100;
	$scope.loading=false;
	$scope.progressStyle={width:'17%'}
	$scope.visualRecords=[];
	$scope.searchRecords="";
	$scope.ascending=false;
	$scope.searchIn="0";
	$scope.filterFrom=new Date("Tue Mar 1 2016");
	$scope.filterTo=new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
	$scope.today=$scope.filterTo.getFullYear()+"-"+((($scope.filterTo.getMonth()+1)>=10)?($scope.filterTo.getMonth()+1):('0'+($scope.filterTo.getMonth()+1)))+"-"+(($scope.filterTo.getDate()>=10)?$scope.filterTo.getDate():('0'+$scope.filterTo.getDate()));
	$scope.filterTo=new Date();
	console.log('filterTo');
	console.log($scope.filterTo);
	var progress=17;
	var resultRecord=[];
	var x;
	var maxDate=$scope.filterTo;
	var minDate=$scope.filterFrom;
	var fromPicker;
	var toPicker;

	$(document).ready( function(){
		
		// var picker = new Pikaday({ field: $('#datepicker')[0] });

		// $('.datepicker').eq(0).pikaday({ minDate : $scope.filterFrom ,maxDate: $scope.filterTo,defaultDate:$scope.filterFrom,setDefaultDate:true});
	
		// $('.datepicker').eq(1).pikaday({ minDate : $scope.filterFrom ,maxDate: $scope.filterTo,defaultDate:$scope.filterTo,setDefaultDate:true});
		
		fromPicker = new Pikaday({ field: document.getElementsByClassName('datepicker')[0] , minDate : minDate ,maxDate: maxDate,defaultDate:$scope.filterFrom,setDefaultDate:true });			
		toPicker = new Pikaday({ field: document.getElementsByClassName('datepicker')[1],minDate : minDate,maxDate: maxDate,defaultDate:$scope.filterTo,setDefaultDate:true });

		$scope.filterFrom=$scope.filterFrom.toString().substring(0,15);
		$scope.filterTo=$scope.filterTo.toString().substring(0,15);

		// $scope.$apply();
		// $('.datepicker').eq(0).pikaday('minDate', $scope.filterFrom);

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

	$scope.getLogs=function(){

		var params="createdBy="+$scope.createdBy+"&fileType="+$scope.searchIn+"&businessPartner="+$scope.businessPartner+"&transactionSet="+$scope.transactionSet+"&version="+$scope.version;		
		params=params+'&from='+$scope.filterFrom+'&to='+$scope.filterTo;
		console.log($scope.filterTo);
		$scope.loading=true;

		console.log('getLogs');

		customHttp.request(params,'/api/ediLog/get','POST',function(data){
			console.log(data);
			if(data.status==true)
			{
				$scope.history=data.data;

				if($scope.history)
				{

					console.log('history');
					console.log($scope.history);

					resultRecord=$scope.history;
					
					for(x in resultRecord)
					{
						var d=new Date(parseInt(resultRecord[x]['Timestamp']));
						resultRecord[x]['Timestamp']=d.toLocaleString();	                          
					}

					$scope.totalRecords=resultRecord.length;

					$scope.loading=false;
					$scope.changePage(1);
				}
				else{
					$scope.loading=false;
					console.log('None found')
					resultRecord=$scope.history;
					$scope.totalRecords=0;
					$scope.visualRecords=[];
				}
			}
			else
			{
				console.log("Error in fetching version");
			}
		});		
	}

	getHistory();	//Because getLogs is not defined

	function getHistory(){
	var businessPartner='';
	var transactionSet='';
	var version='';
	var searchIn='0';
		console.log('Retrieving history');

		businessPartner=localStorage.getItem('businessPartnerSearch')
		if(businessPartner!=null)
		{
			$scope.businessPartner=businessPartner;

			transactionSet=localStorage.getItem('transactionSetSearch')
			if(transactionSet!=null)
			{
				$scope.transactionSet=transactionSet;
			}
			version=localStorage.getItem('versionSearch')
			if(version!=null)
			{
				$scope.version=version;
			}
			searchIn=localStorage.getItem('fileTypeSearch');
			if(searchIn!=null)
			{
				$scope.searchIn=searchIn;
			}
			console.log('Calling getLogs');
			$scope.getLogs();
		}
		else
		{
			console.log('No businessPartner found'+businessPartner);
		}
	}

	$scope.search = function()
	{
		var patt=new RegExp($scope.searchRecords,'i');
		
		findModified({'Agency':patt,'Timestamp':patt,'Username':patt,'BusinessPartner':patt,'Version':patt,'TransactionSet':patt},$scope.history,function(err,res){
			if(err)
			{
				console.error("No result found");
			}
			else
			{
				resultRecord=res;
				$scope.totalRecords=resultRecord.length;
				$scope.presentPage=1;
				$scope.changePage(1);
			}
		});
	}


	$scope.sortData=function(){
		$scope.ascending=!$scope.ascending;
		resultRecord=resultRecord.reverse();
		$scope.changePage(1);
	}

	$scope.changePage=function(page)
	{
		getPage(5,page,resultRecord,function(err,res){
			if(err)
				console.error("Error in pageination");
			else
			{
				$scope.presentPage=page;
				$scope.visualRecords=res;
			}
		});
	}

	$scope.modify=function(index){

		$scope.loading=true;
		var selection=$scope.visualRecords[index];		
		localStorage.setItem('businessPartnerText',selection['BusinessPartner']);
		localStorage.setItem('agency',selection['Agency']);
		localStorage.setItem('version',selection['Version']);
		localStorage.setItem('transactionSet',selection['TransactionSet']);
		localStorage.setItem('segmentPosition',selection['SegmentPosition']);
		localStorage.setItem('segmentUsage',selection['SegmentID']);

		localStorage.setItem('segmentDelimiter',selection['SegmentDelimiter']);
		localStorage.setItem('elementDelimiter',selection['ElementDelimiter']);
		localStorage.setItem('subElementDelimiter',selection['SubElementDelimiter']);

		console.log(selection['ElementUsageDefs']);

		if(typeof(selection['ElementUsageDefs'])!='object')
		{
			selection['ElementUsageDefs']=JSON.parse(selection['ElementUsageDefs']);					
		}

		if(typeof(selection['ElementUsageGroups'])!='object')
		{
			selection['ElementUsageGroups']=JSON.parse(selection['ElementUsageGroups']);
		}

		if(typeof(selection['ElementUsageValue'])!='object')
		{
			selection['ElementUsageValue']=JSON.parse(selection['ElementUsageValue']);
		}

		for(x in selection['ElementUsageDefs'])
		{
			localStorage.setItem('elementUsageDefs:'+x,selection['ElementUsageDefs'][x]);
			localStorage.setItem('elementUsageDefsGroup:'+x,selection['ElementUsageGroups'][x]);
			localStorage.setItem('elementUsageDefsValue:'+x,selection['ElementUsageValue'][x]);			
		}

		if(typeof selection['Code']!='object')		
		{
			selection['Code']=JSON.parse(selection['Code']);
		}

		for(x in selection['Code'])
		{
			localStorage.setItem('code'+x,selection['Code'][x]);
		}

		localStorage.setItem('headingText',selection['Header']);
		localStorage.setItem('footerText',selection['Footer']);

		if(typeof selection['SegmentFooter']!='object')	
		{
			selection['SegmentFooter']=JSON.parse(selection['SegmentFooter']);
		}

		for(x in selection['SegmentFooter'])
		{
			localStorage.setItem('segmentText'+x,selection['SegmentFooter'][x]);	
		}

		$scope.loading=false;

		localStorage.setItem('fileVersion',selection['FileVersion']+1);
		localStorage.setItem('previewMode','0');
		localStorage.setItem('businessPartnerSearch',$scope.businessPartner);
		localStorage.setItem('transactionSetSearch',$scope.transactionSet);
		localStorage.setItem('versionSearch',$scope.version);

		if(selection['FileType']==0)
		{
			window.open('/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setAdditionalData/preview');
		}
		else
		{
			window.open('/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setDelimiters/preview');	
		}
	}


	$scope.preview=function(index){

		$scope.loading=true;
		var selection=$scope.visualRecords[index];		
		localStorage.setItem('businessPartnerText',selection['BusinessPartner']);
		localStorage.setItem('agency',selection['Agency']);
		localStorage.setItem('version',selection['Version']);
		localStorage.setItem('transactionSet',selection['TransactionSet']);
		localStorage.setItem('segmentPosition',selection['SegmentPosition']);
		localStorage.setItem('segmentUsage',selection['SegmentID']);

		localStorage.setItem('segmentDelimiter',selection['SegmentDelimiter']);
		localStorage.setItem('elementDelimiter',selection['ElementDelimiter']);
		localStorage.setItem('subElementDelimiter',selection['SubElementDelimiter']);

		console.log(selection['ElementUsageDefs']);

		if(typeof(selection['ElementUsageDefs'])!='object')
		{
			selection['ElementUsageDefs']=JSON.parse(selection['ElementUsageDefs']);
		}

		if(typeof(selection['ElementUsageGroups'])!='object')
		{
			selection['ElementUsageGroups']=JSON.parse(selection['ElementUsageGroups']);
		}

		if(typeof(selection['ElementUsageValue'])!='object')
		{
			selection['ElementUsageValue']=JSON.parse(selection['ElementUsageValue']);
		}

		for(x in selection['ElementUsageDefs'])
		{
			localStorage.setItem('elementUsageDefs:'+x,selection['ElementUsageDefs'][x]);
			localStorage.setItem('elementUsageDefsGroup:'+x,selection['ElementUsageGroups'][x]);	
			localStorage.setItem('elementUsageDefsValue:'+x,selection['ElementUsageValue'][x]);								
		}

		if(typeof selection['Code']!='object')		
		{
			selection['Code']=JSON.parse(selection['Code']);
		}

		for(x in selection['Code'])
		{
			localStorage.setItem('code'+x,selection['Code'][x]);
		}

		localStorage.setItem('headingText',selection['Header']);
		localStorage.setItem('footerText',selection['Footer']);

		if(typeof selection['SegmentFooter']!='object')	
		{
			selection['SegmentFooter']=JSON.parse(selection['SegmentFooter']);
		}

		for(x in selection['SegmentFooter'])
		{
			localStorage.setItem('segmentText'+x,selection['SegmentFooter'][x]);	
		}

		$scope.loading=false;

		localStorage.setItem('previewMode','1');
		localStorage.setItem('businessPartnerSearch',$scope.businessPartner);
		localStorage.setItem('transactionSetSearch',$scope.transactionSet);
		localStorage.setItem('versionSearch',$scope.version);
		localStorage.setItem('fileTypeSearch',$scope.searchIn);

		if(selection['FileType']==0)
		{
			$location.path('/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setAdditionalData/preview');
		}
		else
		{
			$location.path('/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setDelimiters/preview');	
		}
	}

	$scope.prev = function (){
		$location.path('/home');
	}
}])
