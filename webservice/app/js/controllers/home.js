'use strict';

angular.module('ediCreatorApp')

.controller('HomeCtrl', ['$rootScope','$scope','$location','customHttp',function ($rootScope,$scope,$location,customHttp){	
	
	customHttp.request("",'/api/user/session','POST',function(data){
		if(data.status==true)
		{
			$scope.privilege=data.privilege;			
		}
		else
		{
			$location.path('/login');
		}		
	});

	localStorage.clear();	//localStorage clearing

	$scope.getDraft = function(t){

		var params="fileType="+t;
		var urlPath='/edi/agency';
		var x;

		customHttp.request(params,'/api/edi/getDraft','POST',function(data){
			
			console.log('result');
			console.log(data);

			if(data.data==null||data.data.length==0)
			{
				$location.path(urlPath);
			}
			else
			{
				var draft=data.data[0];

				if(draft['Progress']>0)
				{
					urlPath=urlPath+'/version';
					localStorage.setItem('agency',draft['Agency']);
				}
				if(draft['Progress']>1)
				{
					urlPath=urlPath+'/transactionSet';
					localStorage.setItem('version',draft['Version']);
				}
				if(draft['Progress']>2)
				{
					urlPath=urlPath+'/segmentUsage';
					localStorage.setItem('transactionSet',draft['TransactionSet']);
				}
				if(draft['Progress']>3)
				{
					urlPath=urlPath+'/elementUsageDefs';
					localStorage.setItem('segmentUsage',draft['SegmentID']);
					localStorage.setItem('segmentPosition',draft['SegmentPosition']);
				}
				if(draft['Progress']>4)
				{
					if(t==0)
					{
						urlPath=urlPath+'/setAdditionalData';
					}
					else
					{
						urlPath=urlPath+'/setDelimiters';	
					}
					
					if(typeof(draft['ElementUsageDefs'])!='object')
					{
						draft['ElementUsageDefs']=JSON.parse(draft['ElementUsageDefs']);					
					}

					if(typeof(draft['ElementUsageGroups'])!='object')
					{
						draft['ElementUsageGroups']=JSON.parse(draft['ElementUsageGroups']);
					}

					if(typeof(draft['ElementUsageValue'])!='object')
					{
						draft['ElementUsageValue']=JSON.parse(draft['ElementUsageValue']);
					}

					for(x in draft['ElementUsageDefs'])
					{
						localStorage.setItem('elementUsageDefs:'+x,draft['ElementUsageDefs'][x]);
						localStorage.setItem('elementUsageDefsGroup:'+x,draft['ElementUsageGroups'][x]);
						
						if(draft['ElementUsageValue'][x] !=undefined)
						{
							localStorage.setItem('elementUsageDefsValue:'+x,draft['ElementUsageValue'][x]);			
						}
						else
						{
							localStorage.setItem('elementUsageDefsValue:'+x,'');	
						}
					}

					if(typeof(draft['Code'])!='object')		
					{
						draft['Code']=JSON.parse(draft['Code']);
					}

					for(x in draft['Code'])
					{
						localStorage.setItem('code'+x,draft['Code'][x]);
					}
				}
				console.log(urlPath);
				$location.path(urlPath);									
			}
		});	
	}

	$scope.goEdiGuide = function(){
		localStorage.setItem('creationMode','0');
		$scope.getDraft(0);
		// $location.path('/edi/agency');
	}

	$scope.goEdiFile = function(){
		localStorage.setItem('creationMode','1');
		$scope.getDraft(1);
		// $location.path('/edi/agency');
	}

}])

.controller('LoginCtrl', ['$rootScope','$scope','$location','customHttp',function ($rootScope,$scope,$location,customHttp){	
	$scope.message = "";
	$scope.username="";
	$scope.password="";
	$scope.loading=true;

	customHttp.request("",'/api/user/session','POST',function(data){
		$scope.loading=false;
		if(data.status==true)
		{
			$location.path('/home');			
		}		
	});

	$scope.login = function()
	{
		$scope.loading=true;

		var params;
		params="user="+$scope.username+"&password="+$scope.password;
		customHttp.request(params,'/api/user/authenticate','POST',function(data){
			console.log(data);
			$scope.loading=false;
			if(data.status==true)
			{
				$scope.message="";
				$location.path('/home');
				$rootScope.authenticated=true;
			}
			else
			{
				$scope.message=data.message;
				Materialize.toast('Error!! '+data.message, 2000);
			}
		});
	}

}])
