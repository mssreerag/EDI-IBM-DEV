'use strict';

angular.module('ediCreatorApp')
.controller('HeaderCtrl',['$scope', 'customHttp', 'docReady', '$location', '$cookies','$rootScope', function ($scope,customHttp, docReady, $location, $cookies,$rootScope){

	$scope.optionsActivate=false;
	$scope.ediPage=false;
	$scope.edi=false;
	$scope.name='';	
	$scope.ediMode=0;
	var url = window.location.pathname;

	if(localStorage.getItem('creationMode')!=null)
	{
		$scope.ediMode=parseInt(localStorage.getItem('creationMode'));
	}

	customHttp.request("",'/api/user/session','POST',function(data){
		console.log(data);
		if(data.status==true)
		{
			$scope.name=data.name;
			$rootScope.privilege=data.privilege;
			$scope.optionsActivate=true;
			$(".dropdown-button").dropdown();			
		}
		else
		{
			$location.path('/login');
		}		
	});

	$scope.switch = function(){

		var x;

		$scope.ediMode=($scope.ediMode+1)%2;
		localStorage.setItem('creationMode',$scope.ediMode);

		console.log(url);

		if(url=='/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs')
		{
			window.location.reload()
		}
		else if(url=='/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setAdditionalData')
		{
			$location.path('/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setDelimiters');
		}
		else if(url=='/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setDelimiters')
		{
			$location.path('/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setAdditionalData');
		}
		else if(url=='/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setAdditionalData/preview')
		{
			$location.path('/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setDelimiters/preview');	
		}
		else if(url=='/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setDelimiters/preview')
		{
			$location.path('/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setAdditionalData/preview');	
		}
	}

	$scope.saveAsDraft=function(){

		var x;
		var lurl=url.split('/');
		var progress=0;
		var params="";
		var segmentUsageStub='';
		var elementUsageDefsStub={};
		var mode=0;
		console.log(lurl);

		if(localStorage.getItem('creationMode'))
		{
			mode=localStorage.getItem('creationMode');
		}

		for(x in lurl)
		{
			if(lurl[x]=='version')
			{
				progress=1;
				params=params+"&Agency="+localStorage.getItem('agency');				
			}

			if(lurl[x]=='transactionSet')
			{
				progress=2;
				params=params+"&Version="+localStorage.getItem('version');
			}

			if(lurl[x]=='segmentUsage')
			{
				progress=3;
				params=params+"&TransactionSet="+localStorage.getItem('transactionSet');
			}

			if(lurl[x]=='elementUsageDefs')
			{
				progress=4;

				segmentUsageStub=localStorage.getItem('segmentPosition');
				params=params+"&SegmentPosition="+segmentUsageStub;
				params=params+"&SegmentID="+localStorage.getItem('segmentUsage');
				segmentUsageStub=segmentUsageStub.split(',');
			}

			if(lurl[x]=='setAdditionalData'||lurl[x]=='setDelimiters')
			{
				progress=5;

				var x;
				var elementGroups='';
				var d='';
				var elementUsageDefs='';
				var remoteElementUsageGroups={};
				var elementUsageValue={};
				var remoteCode={};

				// console.log("Element Usage Defs");
				// console.log(segmentUsageStub);
				for(x in segmentUsageStub)
				{
					if(elementUsageDefs=localStorage.getItem('elementUsageDefs:'+segmentUsageStub[x]))
					{
						elementUsageDefsStub[segmentUsageStub[x]]=elementUsageDefs;
						elementGroups=localStorage.getItem('elementUsageDefsGroup:'+segmentUsageStub[x]);
						remoteElementUsageGroups[segmentUsageStub[x]]=elementGroups;
					}

					if(mode==0)
					{
						if(d=localStorage.getItem('code'+segmentUsageStub[x]))
						{
							remoteCode[segmentUsageStub[x]]=d;
						}
					}
					else
					{
						if(localStorage.getItem('elementUsageDefsValue:'+segmentUsageStub[x]))
						{
							elementUsageValue[segmentUsageStub[x]]=localStorage.getItem('elementUsageDefsValue:'+segmentUsageStub[x]);
						}											
					}
				}

				params=params+"&ElementUsageDefs="+JSON.stringify(elementUsageDefsStub);				
				params=params+"&ElementUsageGroups="+JSON.stringify(remoteElementUsageGroups);
				params=params+"&ElementUsageValue="+JSON.stringify(elementUsageValue);

				params=params+"&Code="+JSON.stringify(remoteCode);				

			}
		}

		if(progress>0)
		{
			params=params+"&Progress="+progress;
			params=params+"&FileType="+mode;

			console.log(params);

			customHttp.request(params,'/api/edi/saveAsDraft','POST',function(data){
				console.log(data);
				if(data.status)
				{
					$location.path('/home');
				}
				else
				{
					console.log('Error in draft creation');
				}
			});
		}
	}

	$scope.logout=function(){
		customHttp.request("",'/api/user/logout','POST',function(data){
			if(data.status==true)
			{
				$location.path('/login');
			}
		});		
	}

	$scope.$watch('url', function(){

		if(url.match("/edi")!=null){
			$scope.ediPage=true;
			$scope.edi=true;
		}
		else
		{
			$scope.ediPage=false;
			$scope.edi=false;
		}

		if(url.match("/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setAdditionalData/preview")!=null){
			$scope.ediPage=false;
		}

		if(url.match("/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setDelimiters/preview")!=null){
			$scope.ediPage=false;
		}
    });

}])