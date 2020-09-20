'use strict';

angular.module('ediCreatorApp')


/*

	Agency Controller

*/


.controller('AgencyAndVersionCtrl', ['$location','$rootScope','$scope','customHttp',function ($location,$rootScope,$scope,customHttp){	
	$scope.state=0;
	$scope.loading=false;
	$scope.selectedAgency='';
	$scope.progress=2;
	$scope.initialAgency='';
	$scope.agency=[];
	var agency;
	var x;

	if(agency=localStorage.getItem('agency'))
	{
		console.log('Agency found');
		$scope.initialAgency=agency;
		console.log(agency);
	}
	else
	{
		console.log('No previous agency found');
	}

	$(document).ready(function(){
		$('#sidebar').animate({left:'80%'});
	});

	var params="";
	$scope.loading=true;
	customHttp.request(params,'/api/agency/getAll','POST',function(data){
		if(data.status==true)
		{
			$scope.agency=data.data;

			if($scope.initialAgency!='')
			{
				for(x in data.data)
				{
					if(data.data[x]['Agency']==$scope.initialAgency)
					{
						$scope.selectedAgency=x;
						$scope.initialAgency=x;
						break;
					}
				}
			}
			$scope.state=1;
			$scope.loading=false;
		}
		else
		{
			console.log("Error in fetching agencies");
		}
	});
	$scope.prev= function(){
		$location.path('/home');
	}		
	$scope.next = function(){
		
		if($scope.initialAgency==''||$scope.selectedAgency!=$scope.initialAgency)
		{
			if(!localStorage.getItem('creationMode'))
			{
				localStorage.clear();
			}
			
			localStorage.setItem('agency',$scope.agency[$scope.selectedAgency].Agency);	
		}
		$location.path('/edi/agency/version');
	}

}])


/*

	Version Controller

*/


.controller('VersionCtrl', ['$location','$rootScope','$scope','customHttp',function ($location,$rootScope,$scope,customHttp){	
	
	$scope.presentPage=0;
	$scope.totalRecords=0;
	$scope.loading=false;
	$scope.version=[];
	$scope.selectedVersion={};
	$scope.selectedVersion.id='none';
	$scope.selectedVersion.version='none';
	$scope.selectedVersionStatus=false;
	$scope.visualRecords=[];
	$scope.searchRecords="";
	$scope.progressStyle={width:'2%'};
	var progress=2;
	var resultRecord=[];
	var agency=localStorage.getItem('agency');
	var progressAnimationVariable;
	var progressLimit=100/6;
	var initialVersion='';
	var x;

	progressAnimationVariable=setInterval(progressAnimation,10);

	checkHistory();

	getVersion();

	function checkHistory()
	{
		var version;
		if(version=localStorage.getItem('version'))
		{
			initialVersion=version;
		}
	}

	function progressAnimation()
	{
		progress++;
		$scope.progressStyle.width=progress+'%';
		document.getElementById('progressBar').style.width=progress.toString()+'%';
		if(progress>progressLimit)
		{
			clearInterval(progressAnimationVariable);
		}
	}

	function getVersion(){

		var params="agency="+agency;

		$scope.loading=true;
		customHttp.request(params,'/api/version/getAll','POST',function(data){
			if(data.status==true)
			{
				$scope.version=data.data;
				
				for(x in data.data)
				{
					if(data.data[x]['Version']==initialVersion)
					{
						$scope.selectedVersion.id=data.data[x].Version;
						$scope.selectedVersion.version=data.data[x].Description;
						$scope.selectedVersionStatus=true;
					}
				}

				resultRecord=$scope.version;
				$scope.totalRecords=$scope.version.length;
				$scope.loading=false;
				$scope.changePage(1);
			}
			else
			{
				console.log("Error in fetching version");
			}
		});	
	}	

	$scope.search = function()
	{
		var patt=new RegExp($scope.searchRecords,'i');
		
		findModified({'Version':patt,'Description':patt},$scope.version,function(err,res){
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

	$scope.selectVersion=function(index,x){
		$scope.selectedVersion.id=x.Version;
		$scope.selectedVersion.version=x.Description;
		$scope.selectedVersionStatus=true;
	}

	$scope.prev = function(){
		$location.path('/edi/agency');		
	}

	$scope.next = function(){
		localStorage.setItem('version',$scope.selectedVersion.id);	
		$location.path('/edi/agency/version/transactionSet');
	}

}])


/*

	Transaction Set Controller

*/


.controller('TransactionSetCtrl', ['$location','$rootScope','$scope','customHttp',function ($location,$rootScope,$scope,customHttp){	
	
	$scope.presentPage=0;
	$scope.totalRecords=0;
	$scope.loading=false;
	$scope.progressStyle={width:'17%'}
	$scope.transactionSet=[];
	$scope.transactionSetSelectionStatus={};
	$scope.selectedTransactionSetStatus=false;
	$scope.selectedTransactionSet={};
	$scope.selectedTransactionSet.id='none';
	$scope.selectedTransactionSet.description='none';
	$scope.visualRecords=[];
	$scope.searchRecords="";
	var progress=17;
	var resultRecord=[];
	var agency=localStorage.getItem('agency');
	var version=localStorage.getItem('version');
	var progressAnimationVariable;
	var progressLimit=200/6;
	var initialTransactionSet='';
	var x;

	progressAnimationVariable=setInterval(progressAnimation,10);

	checkHistory();
	getTransactionSet();

	function checkHistory()
	{
		var transactionSet;
		if(transactionSet=localStorage.getItem('transactionSet'))
		{
			initialTransactionSet=transactionSet;
		}
		else
		{
			console.log('No History Found');
		}
	}

	function progressAnimation()
	{
		progress++;
		$scope.progressStyle.width=progress+'%';
		document.getElementById('progressBar').style.width=progress.toString()+'%';
		if(progress>progressLimit)
		{
			clearInterval(progressAnimationVariable);
		}
	}

	function getTransactionSet(){

		var params="agency="+agency+"&version="+version;
		
		$scope.loading=true;
		customHttp.request(params,'/api/transactionSet/getAll','POST',function(data){
			if(data.status==true)
			{
				$scope.transactionSet=data.data;

				if(initialTransactionSet!='')
				{
					for(x in $scope.transactionSet)
					{
						if($scope.transactionSet[x]['TransactionSet']==initialTransactionSet)
						{
							console.log('Setting Transaction set');
							$scope.selectedTransactionSetStatus=true;
							$scope.selectedTransactionSet.id=$scope.transactionSet[x].TransactionSet;
							$scope.selectedTransactionSet.description=$scope.transactionSet[x].Description;
						}
					}
				}

				resultRecord=$scope.transactionSet;
				$scope.totalRecords=resultRecord.length;

				$scope.loading=false;
				$scope.changePage(1);
			}
			else
			{
				console.log("Error in fetching version");
			}
		});		
	}
	$scope.search = function()
	{
		var patt=new RegExp($scope.searchRecords,'i');
		

		findModified({'TransactionSet':patt,'Description':patt},$scope.transactionSet,function(err,res){
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

	$scope.selectTransactionSet=function(index,x){
		$scope.selectedTransactionSetStatus=true;
		$scope.selectedTransactionSet.id=x.TransactionSet;
		$scope.selectedTransactionSet.description=x.Description;
	}

	$scope.prev = function(){
		$location.path('/edi/agency/version')
	}

	$scope.next = function(){
		localStorage.setItem('transactionSet',$scope.selectedTransactionSet.id);
		$location.path('/edi/agency/version/transactionSet/segmentUsage');
	}

}])

/*

	Segment Usage Controller

*/

.controller('SegmentUsageCtrl', ['$location','$rootScope','$scope','customHttp',function ($location,$rootScope,$scope,customHttp){	
	
	$scope.presentPage=0;
	$scope.totalRecords=0;
	$scope.loading=false;
	$scope.progressStyle={width:'33%'}
	$scope.segmentUsage=[];
	$scope.segmentUsageSelectionStatus={};
	$scope.selectedSegmentUsageStatus=false;
	$scope.selectedSegmentUsage=[];
	$scope.visualRecords=[];
	$scope.searchRecords="";
	$scope.selectAllStatus=false;
	$scope.numberOfSelected=0;
	$scope.totalSegments=0;
	$scope.numberOfSegments={};
	$scope.numberOfSegments['H']=0;
	$scope.numberOfSegments['D']=0;
	$scope.numberOfSegments['S']=0;
	$scope.numberOfSegments['']=0;
	$scope.numberOfSegments['F']=0;
	$scope.nextStatus=true;
	var progress=33;
	var resultRecord=[];
	var agency=localStorage.getItem('agency');
	var version=localStorage.getItem('version');
	var transactionSet=localStorage.getItem('transactionSet');
	var progressAnimationVariable;
	var progressLimit=300/6;
	var initialSegmentUsage=[];
	var initialSegmentCtrl=0;
	var segmentElements=0;
	var segmentElementText='';

	progressAnimationVariable=setInterval(progressAnimation,10);

	checkHistory();
	getSegmentUsage();

	function checkHistory()
	{
		var segmentUsage;
		if(segmentUsage=localStorage.getItem('segmentPosition'))
		{
			initialSegmentUsage=segmentUsage.split(',');
			console.log(initialSegmentUsage);
		}
		else
		{
			console.log('No SegmentUsage Data found');
		}
	}

	function progressAnimation()
	{
		progress++;
		$scope.progressStyle.width=progress+'%';
		document.getElementById('progressBar').style.width=progress.toString()+'%';
		if(progress>progressLimit)
		{
			clearInterval(progressAnimationVariable);
		}
	}

	function getSegmentUsage(){

		var params="agency="+agency+"&version="+version+"&transactionSet="+transactionSet;
		
		$scope.loading=true;
		customHttp.request(params,'/api/segmentUsage/getAll','POST',function(data){
			if(data.status==true)
			{
				$scope.segmentUsage=data.data;
				resultRecord=$scope.segmentUsage;
				$scope.totalRecords=resultRecord.length;
				$scope.totalSegments=$scope.totalRecords;
				$scope.numberOfSegments['H']=0;
				$scope.numberOfSegments['D']=0;
				$scope.numberOfSegments['S']=0;
				$scope.numberOfSegments['']=0;
				$scope.numberOfSegments['F']=0;
				var i=0;
				for(i=0;i<resultRecord.length;i++)
				{
					console.log('resultRecord '+resultRecord[i]['Position']+' initialSegmentUsage '+initialSegmentUsage[initialSegmentCtrl]);
					
					if(initialSegmentUsage[0]==undefined)
					{
						if(resultRecord[i]['RequirementDesignator']=='M')
						{
							$scope.segmentUsageSelectionStatus[resultRecord[i]['Position']]=true;
							$scope.numberOfSelected++;
							$scope.numberOfSegments[resultRecord[i]['Section']]++;

							// if(resultRecord[i]['Position']==initialSegmentUsage[initialSegmentCtrl])
							// {
							// 	initialSegmentCtrl++;			
							// }
						}else
						{
							$scope.segmentUsageSelectionStatus[resultRecord[i]['Position']]=false;
							
						}
					}
					else
					{
						if(resultRecord[i]['Position']==initialSegmentUsage[initialSegmentCtrl])
						{
							$scope.segmentUsageSelectionStatus[resultRecord[i]['Position']]=true;
							$scope.numberOfSelected++;
							initialSegmentCtrl++;			
						}
					}
				}				

				$scope.loading=false;
				$scope.changePage(1);
			}
			else
			{
				console.log("Error in fetching version");
			}
		});		
	}
	$scope.search = function()
	{
		var patt=new RegExp($scope.searchRecords,'i');				
		findModified({'SegmentID':patt,'Position':patt},$scope.segmentUsage,function(err,res){
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

	$scope.toggleSegmentUsageSelectAll=function(x){
		var i=0;
		for(i=0;i<resultRecord.length;i++)
		{
			if($scope.selectAllStatus==true)
			{
				$scope.segmentUsageSelectionStatus[resultRecord[i]['Position']]=true;
				$scope.numberOfSelected=$scope.totalRecords;
			}
			else
			{
				if(resultRecord[i]['RequirementDesignator']!='M')
				{
					$scope.segmentUsageSelectionStatus[resultRecord[i]['Position']]=false;
					$scope.numberOfSelected--;
				}
			}
		}
	}

	$scope.removeSelectedElement=function(x){
		$scope.segmentUsageSelectionStatus[x]=false;		
		$scope.numberOfSelected=$scope.numberOfSelected-1;
		$scope.selectAllStatus=false;
	}

	$scope.modifySelection = function(x,index){
	//	if($scope.visualRecords[index]['RequirementDesignator']!='M')
		{
			$scope.segmentUsageSelectionStatus[x]=!$scope.segmentUsageSelectionStatus[x];
			$scope.selectAllStatus=false;
			if($scope.segmentUsageSelectionStatus[x]==false)
				$scope.numberOfSelected=$scope.numberOfSelected-1;
			else
				$scope.numberOfSelected=$scope.numberOfSelected+1;
		}
	}

	$scope.checkElements = function(x){

		var params;
		params="agency="+agency+"&version="+version+"&segmentId="+x;

		customHttp.request(params,'/api/elementUsageDefs/getMandatoryElementStatus','POST',function(data){
			console.log(x+' mandatory element '+segmentElements);
			console.log(data);
			segmentElements++;
			if(segmentElementText=='')
			{
				segmentElementText=x+':'+data.status;
			}
			else
			{
				segmentElementText=segmentElementText+'|'+x+':'+data.status;
			}

			if(segmentElements==$scope.numberOfSelected)
			{
				$scope.goNext();
			}			
		});
	}

	$scope.prev=function(){
		$location.path('/edi/agency/version/transactionSet');
	}

	$scope.next = function(){
		var i=0;
		var selectedSegments='';
		var selectedSegmentsPosition='';
		$scope.nextStatus=false;
		for(i=0;i<$scope.segmentUsage.length;i++)
		{
			if($scope.segmentUsageSelectionStatus[$scope.segmentUsage[i]['Position']]==true)				
			{
				$scope.checkElements($scope.segmentUsage[i]['SegmentID'],$scope.segmentUsage[i]['Position']);
				if(selectedSegments=='')
				{
					selectedSegments=$scope.segmentUsage[i]['SegmentID'].toString();
					selectedSegmentsPosition=$scope.segmentUsage[i]['Position'].toString()
				}
				else					
				{
					selectedSegments=selectedSegments+','+$scope.segmentUsage[i]['SegmentID'].toString();
					selectedSegmentsPosition=selectedSegmentsPosition+','+$scope.segmentUsage[i]['Position'].toString();
				}
			}
		}
		localStorage.setItem('segmentUsage',selectedSegments);
		localStorage.setItem('segmentPosition',selectedSegmentsPosition);
	//	$location.path('/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs');	
	}

	$scope.goNext=function(){
		console.log(segmentElementText);
		localStorage.setItem('segmentMandatoryElement',segmentElementText);
		$location.path('/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs');			
	}

}])


/*

	Element Usage Definitions Controller

*/


.controller('ElementUsageDefsCtrl', ['$location','$rootScope','$scope','customHttp',function ($location,$rootScope,$scope,customHttp){	
	
	$scope.mode=0;	//Mode in which the page is runnning
	$scope.presentPage=0;
	$scope.totalRecords=0;
	$scope.loading=false;
	$scope.progressStyle={width:'50%'};
	$scope.selectedSegments;
	$scope.elementUsage=[];
	$scope.elementUsageValue={};
	$scope.elementUsageSelectionStatus={};
	$scope.selectedElementUsageStatus=false;
	$scope.selectedElementUsage=[];
	$scope.selectedSegments='';
	$scope.visualRecords=[];
	$scope.searchRecords="";
	$scope.selectAllStatus=false;
	$scope.numberOfSelected=-1;
	$scope.totalSegments=0;
	$scope.selectedSegment='';
	$scope.workSavedStatus=false;
	$scope.numberOfSegmentsSaved=0;
	$scope.overallWorkSavedStatus={};
	$scope.allCompleted=false;
	$scope.codeLoading=false;
	$scope.allElementCodes=[];
	$scope.elementCodes=[];
	$scope.numberOfCodesSelected=0;
	$scope.totalNumberOfCodesSelected={};
	$scope.codeSaveStatus=false;
	$scope.codeSearch="";
	$scope.selectedCodes={};
	$scope.emptySegments=false;
	$scope.mandatoryElementStatus={};
	$scope.nextActivate=true;
	$scope.numberOfMandatoryElementReq=0;
	$scope.customCode={};
	$scope.customCodeValue='';
	$scope.customCodeDescription='';
	$scope.customCodeLength=0;
	$scope.customCodeElement = '';
	$scope.allCustomCode = {};
	var presentSegment='';
	var minimumSelection;
	var progress=50;
	var resultRecord=[];
	var agency=localStorage.getItem('agency');
	var version=localStorage.getItem('version');
	var transactionSet=localStorage.getItem('transactionSet');
	var progressAnimationVariable;
	var progressLimit=400/6;

	progressAnimationVariable=setInterval(progressAnimation,10);
	getMode();
	getSelectedSegments();
	checkCompletion();


	function getMode(){

		var mode=0;

		// if(mode=localStorage.getItem('creationMode'))
		// {
		// 	$scope.mode=parseInt(mode);
		// 	console.error('CreationMOde '+$scope.mode);
		// }
		// else
		// {
		// 	console.error('creationMode not found');
		// }
	}

	function checkCompletion()
	{		
		if($scope.selectedSegments.length==$scope.numberOfSegmentsSaved)
		{
			$scope.allCompleted=true;
		}
	}	

	function getSelectedSegments()
	{
		$scope.selectedSegments=localStorage.getItem('segmentUsage');
		$scope.selectedSegmentsPosition=localStorage.getItem('segmentPosition');
		$scope.selectedSegmentsPosition=$scope.selectedSegmentsPosition.split(',');
		$scope.selectedSegments=$scope.selectedSegments.split(',');
		var x;
		var a;
		var mandatoryElement;

		for(x in $scope.selectedSegmentsPosition)
		{
			if(localStorage.getItem('elementUsageDefs:'+$scope.selectedSegmentsPosition[x])==null)
			{
				$scope.overallWorkSavedStatus[$scope.selectedSegments[x]+','+$scope.selectedSegmentsPosition[x]]=false;
			}
			else
			{
				$scope.overallWorkSavedStatus[$scope.selectedSegments[x]+','+$scope.selectedSegmentsPosition[x]]=true;
				$scope.numberOfSegmentsSaved++;
			}
		}

		if(mandatoryElement=localStorage.getItem('segmentMandatoryElement'))
		{
			mandatoryElement=mandatoryElement.split('|');
			for(x in mandatoryElement)
			{
				a=mandatoryElement[x].split(':');

				if(localStorage.getItem('elementOver'))
				{
					a[1]='true';					
				}
				else
				{
					if(a[1]=='false')
					{
						$scope.nextActivate=false;
						$scope.numberOfMandatoryElementReq++;
					}
				}
				$scope.mandatoryElementStatus[a[0]]=a[1];
			}
		}

		console.log('Mandatory Element ');
		console.log($scope.mandatoryElementStatus);

	}

	function progressAnimation()
	{
		progress++;
		$scope.progressStyle.width=progress+'%';
		document.getElementById('progressBar').style.width=progress.toString()+'%';
		if(progress>progressLimit)
		{
			clearInterval(progressAnimationVariable);
		}
	}

	function getElementUsage(x){

		var params="agency="+agency+"&version="+version+"&segmentId="+x;
		
		$scope.loading=true;
		customHttp.request(params,'/api/elementUsageDefs/getWithCode','POST',function(data){
			minimumSelection=0;
			if(data.status==true)
			{
				$scope.elementUsage=data.data;
				resultRecord=$scope.elementUsage;
				$scope.totalRecords=resultRecord.length;
				$scope.totalSegments=$scope.totalRecords;
				var i=0;
				for(i=0;i<resultRecord.length;i++)
				{
					if(resultRecord[i]['RequirementDesignator']=='M')
					{
						$scope.elementUsageSelectionStatus[resultRecord[i]['Position']]=true;
						minimumSelection++;						
					}
					else
					{
						$scope.elementUsageSelectionStatus[resultRecord[i]['Position']]=false;
					}
				}

				$scope.numberOfSelected=minimumSelection;

				getSelectedElementsFromLocalStorage();			
				getCodeFromLocalStorage();
				$scope.workSavedStatus=true;
				$scope.loading=false;
				$scope.changePage(1);
				presentSegment=$scope.selectedSegment;
			}
			else
			{
				console.log("Error in fetching elements");
			}
		});		
	}

	function getCodeFromLocalStorage(){
		var data='';
		var codeParts;
		var selectedSegment=$scope.selectedSegment.split(',');
		var x;
		var codeSide;
		$scope.selectedCodes={};
		$scope.totalNumberOfCodesSelected={};				
		if(data=localStorage.getItem('code'+selectedSegment[1]))
		{
			data=data.split('%');

			for(x in data)
			{
				codeParts=data[x].split('#')
				$scope.selectedCodes[codeParts[0]]=codeParts[1];
				codeSide=codeParts[1].split('$');
				$scope.totalNumberOfCodesSelected[codeParts[0]]=codeSide.length;
			}

		}
		else
		{
			console.log("Code not Found in local Storage");
		}
	}

	function getSelectedElementsFromLocalStorage(){

		var selectedElementsLocal='';
		var selectedSegment=$scope.selectedSegment.split(','); 
		var storageValues='';
		console.log('Local');
		console.log(selectedSegment[1])
		if(storageValues=localStorage.getItem('elementUsageDefsValue:'+selectedSegment[1]))
		{
			storageValues=storageValues.split(',');
		}
		if(selectedElementsLocal=localStorage.getItem('elementUsageDefs:'+selectedSegment[1]))
		{
			selectedElementsLocal=selectedElementsLocal.split(',');
			var i=0;
			var ctr=0;
			$scope.numberOfSelected=0;
			for(i=0;i<resultRecord.length;i++)
			{
				if(resultRecord[i]['Position']==selectedElementsLocal[ctr])
				{
					$scope.elementUsageValue[resultRecord[i]['Position']]=storageValues[ctr];
					$scope.elementUsageSelectionStatus[selectedElementsLocal[ctr]]=true;				
					ctr++;
					$scope.numberOfSelected++;
					// if(resultRecord[i]['RequirementDesignator']!='M')
					// {
					// 	$scope.numberOfSelected++;
					// }
				}
				else
				{
					$scope.elementUsageSelectionStatus[resultRecord[i]['Position']]=false;
				}
			}
			$scope.workSavedStatus=true;
		}
		else
		{
			$scope.elementUsageValue={};
			$scope.workSavedStatus=false;
		}
	}

	$scope.findElements = function()
	{
		var selectedSegment;
		selectedSegment=$scope.selectedSegment.split(',');
		if($scope.workSavedStatus==true||presentSegment=='')
		{
			getElementUsage(selectedSegment[0]);
		}
		else if(presentSegment!='')
		{
			$('#warningModal').openModal();
		}
	}

	$scope.openCustomCodeModal = function(x)
	{
		x=x.Position;
		$scope.customCodeElement = x;
		var selectedSegment = $scope.selectedSegment.split(',') [1];
		$scope.customCode = {} ; 		
		$scope.customCodeValue='';
		$scope.customCodeDescription='';
		var storageCode='';
		var temp='';
		var temp1='';
		var y;

		if(storageCode = localStorage.getItem('customCode'+selectedSegment))
		{
			storageCode = storageCode.split('%');
			for(x in storageCode)
			{
				temp=storageCode[x].split('#');
				console.log('sdkfsdnfkjdsf');
				console.log(temp[0]);
				console.log($scope.customCodeElement);
				if(temp[0] === $scope.customCodeElement.toString())
				{
					temp = temp[1].split('$');
					for(y in temp)
					{
						temp1 = temp[y].split('@');
						$scope.customCode[temp1[0]] = { 'value': temp1[0],
														'description': temp1[1],
														'select':true 
													};
					}
				}
			}
		}
		$('#customCodeModal').openModal();
	}

	// $scope.openCustomCodeModal(2);

	$scope.saveCustomCode = function()
	{
		var selectedSegment = $scope.selectedSegment.split(',') [1];
		var obj = { 'value': $scope.customCodeValue, 
					'description': $scope.customCodeDescription, 
					'select': true
				};
		
		$scope.customCode[obj.value] = obj;

		console.log($scope.customCode);
	}

	$scope.saveSelectedCustomCodes = function()
	{
		var selectedSegment = $scope.selectedSegment.split(',') [1];
		var storageCode = '';
		var data='';
		for(x in $scope.customCode)
		{
			if($scope.customCode[x]['select'])
			{
				if(data=='')
				{
					data = $scope.customCode[x]['value']+'@'+$scope.customCode[x]['description'];
				}
				else
				{
					data=data+'$'+$scope.customCode[x]['value']+'@'+$scope.customCode[x]['description'];
				}
			}			
		}
		
		if(storageCode = localStorage.getItem('customCode'+selectedSegment))
		{
			var temp;
			var x,y;
			var resStorageCode='';
			var saved=false;
			var temp2=storageCode;
			storageCode=storageCode.split('%');
			for(x in storageCode)
			{
				temp = storageCode[x].split('#');
				if(temp[0] === $scope.customCodeElement.toString())
				{
					saved=true;
					temp[1]=data;
					if(x==0)
					{
						storageCode = temp[0]+'#'+temp[1];
					}
					else
					{
						storageCode = storageCode+'%'+temp[0]+'#'+temp[1];
					}
				}
			}
			if(!saved)
			{
				if(temp2=='')
				{
					data=$scope.customCodeElement+'#'+data;	
				}
				else
				{
					data=temp2+'%'+$scope.customCodeElement+'#'+data;	
				}
				localStorage.setItem('customCode'+selectedSegment, data);
			}
			else
			{
				localStorage.setItem('customCode'+selectedSegment , storageCode);
			}
		}
		else
		{
			localStorage.setItem('customCode'+selectedSegment , $scope.customCodeElement+'#'+data);	
		}
		Materialize.toast('Custom Codes Saved!', 4000);
		// $('#customCodeModal').closeModal();
	}

	$scope.getCode = function(x)
	{
		$scope.codeSelectedElement=x.Position;
		$('#codeModal').openModal();
		$scope.codeLoading=true;
		var y;
		var f=0;
		var params="agency="+x['Agency']+"&version="+x['Version']+"&element="+x['ElementID'];

		customHttp.request(params,'/api/code/get','POST',function(data){
			if(data.status==true)
			{
				if(data.data.length>0)
				{
					$scope.elementCodes=data.data;					
					var elementCodes=data.data;
					var code=$scope.selectedCodes[$scope.codeSelectedElement];
					if(code)
					{
						f=1;
						code=code.split('$');
					}
					else
					{
						f=0;
					}
					for(x in elementCodes)
					{						

						elementCodes[x]['select']=false;

						if(f==1)
						{
							for(y in code)
							{
								if(code[y].split('@')[0]==elementCodes[x]['Value'])
									elementCodes[x]['select']=true;								
							}
						}
					}
					$scope.elementCodes=elementCodes;
					$scope.allElementCodes=$scope.elementCodes;					
					$scope.numberOfCodesSelected=0;
					$scope.codeLoading=false;
				}
				else
				{
					console.log("No Codes Found");
				}
			}
			else
			{
				console.log("Error in fetching elements");
			}
		});
	}

	$scope.modifyCodeSelection = function(x){
		$scope.codeSaveStatus=false;
		$scope.workSavedStatus=false;
		if(x['select']==true)
			$scope.numberOfCodesSelected++;
		else
			$scope.numberOfCodesSelected--;

		//console.log("Modify selection : "+$scope.numberOfCodesSelected);
	}

	$scope.searchCodes=function(x)
	{
		var patt=new RegExp(x,'i');		
		//console.log($scope.allElementCodes.length);		
		findModified({'Value':patt},$scope.allElementCodes,function(err,res){
			if(err)
			{
				console.error("No result found");
			}
			else
			{
				//console.log(res.length);
				$scope.elementCodes=res;
			}
		});
	}

	$scope.saveCodes=function()
	{
		// $scope.codeLoading=true;
		var data='';
		var x;
		var ctr=0;
		for(x in $scope.allElementCodes)
		{
			if($scope.allElementCodes[x]['select']==true)
			{
				ctr++;
				if(data=='')
					data=$scope.allElementCodes[x]['Value']+'@'+$scope.allElementCodes[x]['Description'];
				else
				{
					data=data+'$'+$scope.allElementCodes[x]['Value']+'@'+$scope.allElementCodes[x]['Description'];
				}
			}
		}
		if(data!='')
		{
			//console.log('Code Saved {code'+$scope.codeSelectedElement+' : '+data+'}')
			$scope.selectedCodes[$scope.codeSelectedElement]=data;
			//console.log($scope.selectedCodes);
			$scope.codeSaveStatus=true;
			$scope.totalNumberOfCodesSelected[$scope.codeSelectedElement]=ctr;
			Materialize.toast('Codes Saved!', 4000);
		}
		else
		{
			//console.log("No code data present");
			Materialize.toast('No Codes Present!', 4000);
		}
	}	

	$scope.modalGoBack = function()
	{
		$scope.selectedSegment=presentSegment;
	}

	$scope.forceFindElements = function()
	{
		var selectedSegment;
		selectedSegment=$scope.selectedSegment.split(',');
		getElementUsage(selectedSegment[0]);		
	}

	$scope.search = function()
	{
		var patt=new RegExp($scope.searchRecords,'i');				
		findModified({'Description':patt,'ElementID':patt,'Position':patt},$scope.elementUsage,function(err,res){
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

	$scope.toggleElementUsageSelectAll=function(x){
		var i=0;
		for(i=0;i<resultRecord.length;i++)
		{
			if($scope.selectAllStatus==true)
			{
				$scope.elementUsageSelectionStatus[resultRecord[i]['Position']]=true;
				$scope.numberOfSelected=$scope.totalRecords;
			}
			else if(resultRecord[i]['RequirementDesignator']!='M')
			{
				$scope.elementUsageSelectionStatus[resultRecord[i]['Position']]=false;
				$scope.numberOfSelected=minimumSelection;
			}
		}
		$scope.workSavedStatus=false;
	}

	$scope.activateSaveButton = function(){
		$scope.workSavedStatus=false;
	}

	$scope.modifySelection = function(x){

		$scope.elementUsageSelectionStatus[x]=!$scope.elementUsageSelectionStatus[x];
		$scope.selectAllStatus=false;
		if($scope.elementUsageSelectionStatus[x]==false)
			$scope.numberOfSelected=$scope.numberOfSelected-1;
		else
			$scope.numberOfSelected=$scope.numberOfSelected+1;
		
		$scope.workSavedStatus=false;
	}

	$scope.removeSelectedElement=function(x){
		$scope.elementUsageSelectionStatus[x]=false;		
		$scope.numberOfSelected=$scope.numberOfSelected-1;
		$scope.selectAllStatus=false;
		$scope.workSavedStatus=false;
	}

	$scope.saveElements = function(){

		var selectedElement='';
		var selectedSegment='';
		var selectedElementValue='';
		var groupId='';
		var i=0;

		if($scope.mandatoryElementStatus[resultRecord[0]['SegmentID']]=='false')
		{
			$scope.mandatoryElementStatus[resultRecord[0]['SegmentID']]='true';
			$scope.numberOfMandatoryElementReq--;
		}

		if($scope.numberOfMandatoryElementReq==0)
		{
			$scope.nextActivate=true;
			localStorage.setItem('elementOver','1');
		}

		console.log('ElementUsage value');

		for(i=0;i<resultRecord.length;i++)
		{
			
			if($scope.elementUsageSelectionStatus[resultRecord[i]['Position']]==true)
			{
				// if($scope.mode==1)
				{
					
					if(selectedElementValue=='')
					{
						if(!$scope.elementUsageValue[resultRecord[i]['Position']])
						{
							selectedElementValue='XXXXX';	
						}
						else
						{
							selectedElementValue=$scope.elementUsageValue[resultRecord[i]['Position']];
						}
					}
					else
					{
						if(!$scope.elementUsageValue[resultRecord[i]['Position']])
						{
							selectedElementValue=selectedElementValue+',XXXXX';	
						}
						else
						{
							selectedElementValue=selectedElementValue+','+$scope.elementUsageValue[resultRecord[i]['Position']];	
						}
					}
				}

				if(selectedElement=='')
				{
					selectedElement=resultRecord[i]['Position'];
				}
				else
				{
					selectedElement=selectedElement+','+resultRecord[i]['Position'];	
				}
			}

			if(i==0)
			{
				groupId=resultRecord[i]['GroupRequirementDesignatorID'];
			}	
			else
			{
				groupId=groupId+','+resultRecord[i]['GroupRequirementDesignatorID'];				
			}
		}

		selectedSegment=$scope.selectedSegment.split(',');	
		localStorage.setItem('elementUsageDefs:'+selectedSegment[1],selectedElement);
		localStorage.setItem('elementUsageDefsGroup:'+selectedSegment[1],groupId);

		// if($scope.mode==1)
		{
			localStorage.setItem('elementUsageDefsValue:'+selectedSegment[1],selectedElementValue);
		}

		var storeData='';

		for(x in $scope.selectedCodes)
		{
			if(storeData=='')
			{
				storeData=x+"#"+$scope.selectedCodes[x];
			}
			else
			{
				storeData=storeData+'%'+x+"#"+$scope.selectedCodes[x];
			}	
		}
		//console.log(storeData);
		localStorage.setItem('code'+selectedSegment[1],storeData);
		$scope.workSavedStatus=true;
		$scope.overallWorkSavedStatus[$scope.selectedSegment]=true;

		var x;
		i=0;
		for(x in $scope.overallWorkSavedStatus)
		{
			if($scope.overallWorkSavedStatus[x]==true)
			{
				i++;
			}
		}
		$scope.numberOfSegmentsSaved=i;

		checkCompletion();
	}

	$scope.prev=function(){
		$location.path('/edi/agency/version/transactionSet/segmentUsage');		
	}

	$scope.next = function(){

		var mode=0;
		if(mode=parseInt(localStorage.getItem('creationMode')))
		{
			if(mode==0)
			{
				$location.path('/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setAdditionalData');;
			}
			else
			{				
				$location.path('/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/elementValue');		
			}
		}
		else
		{
			$location.path('/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setAdditionalData');
		}
	}	

	$scope.dummy = function()
	{
    	
	}

}])

.controller('ElementUsageDefsValueCtrl', ['$location','$rootScope','$scope','customHttp',function ($location,$rootScope,$scope,customHttp){	

	$scope.loading=false;
	$scope.progressStyle={width:'50%'};
	$scope.segmentUsagePosition=[];
	$scope.segmentUsage=[];
	$scope.elementUsageGroups={};
	$scope.elementUsageDefs=[];
	$scope.elementUsageValue={};
	$scope.elementValue={};
	$scope.elementUsage={};
	$scope.code={};

	var numberOfSegmentsRetrieved=0;
	var totalSegments=0;
	var progress=83;
	var progressAnimationVariable;
	var progressLimit=450/6;

	progressAnimationVariable=setInterval(progressAnimation,10);
	getAgency();
	getVersion();
	getTransactionSet();
	getSegmentUsageStub();
	getElementUsageDefs();

	function progressAnimation()
	{
		progress++;
		$scope.progressStyle.width=progress+'%';
		document.getElementById('progressBar').style.width=progress.toString()+'%';
		if(progress>progressLimit)
		{
			clearInterval(progressAnimationVariable);
		}
	}

	function getAgency()
	{	
		var agencyStub='';
		if(agencyStub=localStorage.getItem('agency'))
		{
			$scope.agency=agencyStub;
			console.log('Agency');
			console.log($scope.agency);
		}
		else
		{
			console.error("Agency local Storage not found");		
		}
	}

	function getVersion()
	{
		var versionStub='';
		if(versionStub=localStorage.getItem('version'))
		{
			$scope.version=versionStub;
			console.log('Version');
			console.log($scope.version);
		}
		else
		{
			console.error("Version local Storage not found");		
		}		
	}	

	function getTransactionSet()
	{
		var transactionSetStub='';
		if(transactionSetStub=localStorage.getItem('transactionSet'))
		{
			$scope.transactionSet=transactionSetStub;
			console.log('transactionSet');
			console.log($scope.transactionSet);
		}
		else
		{
			console.error("Transaction Set local Storage not found");
		}
	}


	function getSegmentUsageStub()
	{
		var segmentUsageStub='';
		if(segmentUsageStub=localStorage.getItem('segmentPosition'))
		{
			segmentUsageStub=segmentUsageStub.split(',');
			$scope.segmentUsagePosition=segmentUsageStub;				
		}
		else
		{
			console.error("Segment Usage Position local Storage not found");
		}

		if(segmentUsageStub=localStorage.getItem('segmentUsage'))
		{
			segmentUsageStub=segmentUsageStub.split(',');
			$scope.segmentUsage=segmentUsageStub;				
		}
		else
		{
			console.error("Segment Usage local Storage not found");
		}

		totalSegments=$scope.segmentUsagePosition.length;
		console.log('segmentPosition');
		console.log($scope.segmentUsagePosition);
		console.log('segmentUsage');
		console.log($scope.segmentUsage);
	}

	function checkCompletion()
	{		
		var a,x,y,z;
		console.log("Number of segments retrieved "+numberOfSegmentsRetrieved);
		console.log("totalSegments "+totalSegments);
		if(numberOfSegmentsRetrieved==totalSegments)
		{
			console.log('Remote Elements');
			console.log($scope.elementUsage);
			console.log('ElementUsageDefs');
			console.log($scope.elementUsageDefs);
			console.log('ElementUsageDefsValue');
			console.log($scope.elementUsageValue);
			numberOfSegmentsRetrieved=0;
			var tempEleValue={};
			tempEleValue=$scope.elementValue;
			console.log('$scope.elementValue');
			console.log($scope.elementValue);
			getCodesParallel();

			for(x in $scope.segmentUsagePosition)
			{
				if($scope.code[$scope.segmentUsagePosition[x]]!=undefined&&$scope.code[$scope.segmentUsagePosition[x]]!=null)
				{
					for(a=0;a<$scope.code[$scope.segmentUsagePosition[x]]['maxCodes'];a++)
					{
						$scope.elementValue[$scope.segmentUsagePosition[x]][a]={};
						console.log('tempEleValue');
						console.log($scope.elementUsage);
						tempEleValue=$scope.elementUsageValue;
						for(z in $scope.elementUsage[$scope.segmentUsagePosition[x]])
						{
							// console.log($scope.code[$scope.segmentUsagePosition[x]]);
							console.log(tempEleValue[$scope.segmentUsagePosition[x]]);
							if($scope.code[$scope.segmentUsagePosition[x]][$scope.elementUsage[$scope.segmentUsagePosition[x]][z]['Position']]==undefined||$scope.code[$scope.segmentUsagePosition[x]][$scope.elementUsage[$scope.segmentUsagePosition[x]][z]['Position']]==null||$scope.code[$scope.segmentUsagePosition[x]][$scope.elementUsage[$scope.segmentUsagePosition[x]][z]['Position']][a]==undefined||$scope.code[$scope.segmentUsagePosition[x]][$scope.elementUsage[$scope.segmentUsagePosition[x]][z]['Position']][a]==null)
							{
								$scope.elementValue[$scope.segmentUsagePosition[x]][a][$scope.elementUsage[$scope.segmentUsagePosition[x]][z]['Position']]='XXXXX';
							}
							else
							{
								$scope.elementValue[$scope.segmentUsagePosition[x]][a][$scope.elementUsage[$scope.segmentUsagePosition[x]][z]['Position']]=$scope.code[$scope.segmentUsagePosition[x]][$scope.elementUsage[$scope.segmentUsagePosition[x]][z]['Position']][a]['value'];	
							}
						}
					}
				}
				else
				{

				}
			}			
		}
	}

	function checkCompletion1()
	{		
		console.log("Number of segments retrieved "+numberOfSegmentsRetrieved);
		console.log("totalSegments "+totalSegments);
		if(numberOfSegmentsRetrieved>=totalSegments)
		{
			console.log('ElementUsageDefs');
			console.log($scope.elementUsageDefs);			
		}
	}

	function getElementUsageFromRemote(x,segmentPosition)
	{
		var z;
		var params;
		params="agency="+$scope.agency+"&version="+$scope.version+"&segmentId="+x	;

		customHttp.request(params,'/api/elementUsageDefs/get','POST',function(data)
		{

			console.log('Remote Element retrieval ');
			console.log(data);
			console.log(params);

			if(data.status==true)
			{
				$scope.elementUsageGroups[segmentPosition]=[];												
				$scope.elementUsage[segmentPosition]={};
				for(z in data.data)
				{
					$scope.elementUsageGroups[segmentPosition].push(data.data[z]['GroupRequirementDesignatorID']);

					$scope.elementUsage[segmentPosition][data.data[z]['Position']]=data.data[z];
					$scope.elementValue[segmentPosition][0][data.data[z]['Position']]='XXXXX';	
				}
				numberOfSegmentsRetrieved++;
				checkCompletion();
			}
			else
			{
				console.log("Error in fetching Element "+segmentUsageStub[numberOfSegmentsRetrieved]+":"+elementUsageDefs[segmentUsageStub[numberOfSegmentsRetrieved]][numberOfElementsRetrieved]);
			}
		});
	}

	function getElementUsageDefs()
	{
		var elementUsageDefs='';
		var elementGroups='';
		var x;

		for(x in $scope.segmentUsagePosition)
		{
			$scope.elementValue[$scope.segmentUsagePosition[x]]={};
			$scope.elementValue[$scope.segmentUsagePosition[x]][0]={};			
			if(elementUsageDefs=localStorage.getItem('elementUsageDefs:'+$scope.segmentUsagePosition[x]))
			{
				elementGroups=localStorage.getItem('elementUsageDefsGroup:'+$scope.segmentUsagePosition[x])
				
				// numberOfSegmentsRetrieved++;
				$scope.elementUsageDefs[$scope.segmentUsagePosition[x]]=elementUsageDefs.split(',');
				$scope.elementUsageGroups[$scope.segmentUsagePosition[x]]=elementGroups.split(',');
				$scope.elementUsageValue[$scope.segmentUsagePosition[x]]=localStorage.getItem('elementUsageDefsValue:'+$scope.segmentUsagePosition[x]).split(',');
				getElementUsageFromRemote($scope.segmentUsage[x],$scope.segmentUsagePosition[x]);
			}
			else
			{		
				getMandatoryElements($scope.segmentUsage[x],$scope.segmentUsagePosition[x]);		
				console.log('ElementUsage not found');
			}
		}

		console.log('elementUsageDefs');
		console.log($scope.elementUsageDefs);
		console.log('elementUsageDefsValue');
		console.log($scope.elementUsageValue);

		// checkCompletion();

	}

	function getMandatoryElements(x,segmentPosition)
	{
		var z;
		var params;
		params="agency="+$scope.agency+"&version="+$scope.version+"&segmentId="+x	;

		customHttp.request(params,'/api/elementUsageDefs/get','POST',function(data)
		{

			console.log('Mandatory Element retrieval ');
			console.log(data);
			console.log(params);

			if(data.status==true)
			{
				$scope.elementUsageGroups[segmentPosition]=[];												
				$scope.elementUsage[segmentPosition]={};
				for(z in data.data)
				{
					$scope.elementUsageGroups[segmentPosition].push(data.data[z]['GroupRequirementDesignatorID']);

					$scope.elementUsage[segmentPosition][data.data[z]['Position']]=data.data[z];

					if(data.data[z]['RequirementDesignator']=='M')
					{
						if($scope.elementUsageDefs[segmentPosition]==undefined)
						{
							$scope.elementUsageDefs[segmentPosition]=[];
							$scope.elementUsageValue[segmentPosition]=[];	
							// $scope.elementUsageDefs[segmentPosition][data.data[z]['Position']]=data.data[z];
							$scope.elementUsageDefs[segmentPosition].push(data.data[z]['Position']);
							$scope.elementUsageValue[segmentPosition].push('XXXXX');
							$scope.elementValue[segmentPosition][0][data.data[z]['Position']]='XXXXX';
						}
						else
						{
							$scope.elementUsageDefs[segmentPosition].push(data.data[z]['Position']);
							$scope.elementUsageValue[segmentPosition].push('XXXXX');						
							$scope.elementUsageGroups[segmentPosition].push(data.data[z]['GroupRequirementDesignatorID']);							
							// $scope.elementUsageDefs[segmentPosition][data.data[z]['Position']]=data.data[z];
						}
					}
				}
				numberOfSegmentsRetrieved++;
				checkCompletion();
			}
			else
			{
				console.log("Error in fetching Element "+segmentUsageStub[numberOfSegmentsRetrieved]+":"+elementUsageDefs[segmentUsageStub[numberOfSegmentsRetrieved]][numberOfElementsRetrieved]);
			}
		});
	}


	function getCodesParallel(){
		var data='';
		var codeParts;
		var a,b,c,x,y,z;
		var codeSide;
		var eleSide;
		var mainPart;
		var ctr=0;
		var segmentUsageStub=$scope.segmentUsagePosition;
		var remoteCode={};
		var max=0;
		
		numberOfSegmentsRetrieved=0;
	
		for(x in segmentUsageStub)
		{
			max=0;
			if(data=localStorage.getItem('code'+segmentUsageStub[x]))
			{
				//Remote code logging
				remoteCode[segmentUsageStub[x]]=data;

				$scope.code[segmentUsageStub[x]]={};
				
				data=data.split('%');

				console.log('data');
				console.log(data);

				for(y in data)
				{
					codeParts=data[y].split('#')
					console.log("data[y]");
					console.log(codeParts);
					eleSide=codeParts[0];
					codeSide=codeParts[1].split('$');
					$scope.code[segmentUsageStub[x]][eleSide]=[];
					ctr=0;
					for(y in codeSide)
					{
						$scope.code[segmentUsageStub[x]][eleSide][ctr]={};						
						mainPart=codeSide[y].split('@');
						$scope.code[segmentUsageStub[x]][eleSide][ctr]={'value':mainPart[0],'description':mainPart[1]};
					
						ctr++;	
					}

					if(ctr>max)
					{
						max=ctr;
						$scope.code[segmentUsageStub[x]]['maxCodes']=max;
						$scope.code[segmentUsageStub[x]]['maxEle']=eleSide;
					}	
				}

				console.log("Code from localStorage");
				console.log($scope.code);
			}
			else
			{
				console.log("Code not Found in local Storage");
			}
		}
		console.log("code");
		console.log($scope.code);
		// wrap();
	}

	$scope.prev = function(){
		$location.path('/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs');				
	}

	$scope.next= function(){
		console.log($scope.elementValue);
		console.log(JSON.stringify($scope.elementValue));
		localStorage.setItem('elementValue',JSON.stringify($scope.elementValue))
		$location.path('/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setDelimiters');		
	}

}])

.controller('SetAdditionalDataCtrl', ['$location','$rootScope','$scope','customHttp',function ($location,$rootScope,$scope,customHttp){	
	
	$scope.progressStyle={width:'83%'};	
	$scope.loading=false;
	$scope.segmentPosition;
	$scope.segmentName;
	$scope.headingText='';
	$scope.businessPartnerText='';
	$scope.footerText='';
	$scope.segmentText={};
	$scope.selectedSegment='';
	$scope.textArea='';
	$scope.previousSegment='';
	$scope.saveStatus={};
	$scope.activateArea={};
	$scope.editStatus=false;
	$scope.headingEdit=true;
	$scope.businessPartnerEdit=true;
	$scope.footerEdit=true;
	$scope.fileVersion=1;

	var progress=83;
	var progressLimit=90;
	var progressAnimationVariable;

	progressAnimationVariable=setInterval(progressAnimation,10);
	
	getHistory();
	getSegments();	
	console.log('Auto-resizing');
	$('#heading-text-area').trigger('autoresize');
	$('#footer-text-area').trigger('autoresize');

	function getHistory()
	{
		var businessPartnerText=''
		var headingText='';
		var footerText='';
		if(businessPartnerText=localStorage.getItem('businessPartnerText'))
		{
			$scope.businessPartnerEdit=false;
			$scope.businessPartnerText=businessPartnerText;
			$('#business-partner-text-area').val($scope.businessPartnerText);
			console.log('BusinessPartnertext found');
		}
		else
		{
			console.log('BusinessPartnerText text not found');
		}		
		if(headingText=localStorage.getItem('headingText'))
		{
			$scope.headingEdit=false;
			$scope.headingText=headingText;
			console.log('headingText '+$scope.headingText);
			$('#heading-text-area').val($scope.headingText);
		}
		else
		{
			console.log('Heading text not found');
		}
		if(footerText=localStorage.getItem('footerText'))
		{
			$scope.footerEdit=false;
			$scope.footerText=footerText;
			$('#footer-text-area').val($scope.footerText);
		}
		else
		{
			console.log('Footer text not found');
		}
	}

	function progressAnimation()
	{
		progress++;
		$scope.progressStyle.width=progress+'%';
		document.getElementById('progressBar').style.width=progress.toString()+'%';
		if(progress>progressLimit)
		{
			clearInterval(progressAnimationVariable);
		}
	}

	function getSegments()
	{
		var x;
		var segmentUsageStub;
		var segmentText;
		if(segmentUsageStub=localStorage.getItem('segmentPosition'))
		{
			$scope.segmentPosition=segmentUsageStub.split(',');

			for(x in $scope.segmentPosition)
			{
				segmentText='';
				$scope.segmentText[$scope.segmentPosition[x]]='';
				$scope.saveStatus[$scope.segmentPosition[x]]=false;
				
				if(segmentText=localStorage.getItem('segmentText'+$scope.segmentPosition[x]))
				{
					$scope.segmentText[$scope.segmentPosition[x]]=segmentText;
				}	
				else
				{
					console.log('Segment text not found');
				}
			}
							
		}
		else
		{
			console.error("Segment Usage Position local Storage not found");
		}

		if(segmentUsageStub=localStorage.getItem('segmentUsage'))
		{
			$scope.segmentName=segmentUsageStub.split(',');							
		}
		else
		{
			console.error("Segment Usage Name local Storage not found");
		}
	}

	$scope.saveText = function()
	{
		if($scope.segmentText[$scope.selectedSegment]=='')
		{
			$scope.editStatus=true;
		}
		else
		{
			$scope.editStatus=false;	
		}
		
		//if($scope.previousSegment!='')
		{
			console.log($scope.textArea);
			$scope.segmentText[$scope.previousSegment]=$scope.textArea;
			$scope.textArea=$scope.segmentText[$scope.selectedSegment];
			
			setTimeout(function(){
				console.log('Auto resizing');
				$('#textArea').trigger('autoresize');
			},500)
		}
		console.log($scope.previousSegment);
		console.log($scope.selectedSegment);
		console.log($scope.segmentText);
		$scope.previousSegment=$scope.selectedSegment;
	}

	$scope.enableHeadingEdit = function()
	{
		$scope.headingEdit=true;
	}

	$scope.enableBusinessPartnerEdit = function()
	{
		$scope.businessPartnerEdit =true;
		console.log($scope.businessPartnerEdit);
	}

	$scope.enableFooterEdit = function()
	{
		$scope.footerEdit=true;
	}

	$scope.enableEdit = function()
	{
		$scope.editStatus=true;
	}

	$scope.prev=function(){

		$location.path('/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs');	
	
	}

	$scope.checkExistance = function(){

		var params="businessPartner="+$scope.businessPartnerText;
		params=params+"&fileVersion=0";
		params=params+"&agency="+localStorage.getItem('agency');
		params=params+"&version="+localStorage.getItem('version');
		params=params+"&transactionSet="+localStorage.getItem('transactionSet');

		console.log('check version');
		console.log(params);

		customHttp.request(params,'/api/ediLog/latestFileVersion','POST',function(data){
			if(data.status==true)
			{
				var version=data.data;
				if(typeof (version) == 'number')
				{
					$('#warningModal').openModal();
					$scope.fileVersion=version+1;
				}
				else
				{
					$scope.goNext();		
				}
			}
			else
			{
				$scope.goNext();
			}
			console.log('fileVersion : '+$scope.fileVersion)
			localStorage.setItem('fileVersion',$scope.fileVersion);

		});		

	}

	$scope.next=function(){
		var x;
		var result='';		

		$scope.segmentText[$scope.selectedSegment]=$scope.textArea;

		for(x in $scope.segmentText)
		{
			if($scope.segmentText[x]!='')
				localStorage.setItem('segmentText'+x,$scope.segmentText[x]);
		}

		$scope.checkExistance();

		localStorage.setItem('headingText',$scope.headingText);
		localStorage.setItem('businessPartnerText',$scope.businessPartnerText);
		localStorage.setItem('footerText',$scope.footerText);

		localStorage.setItem('previewMode','0');

		// $location.path('/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setAdditionalData/preview');
	}

	$scope.goNext= function(){
		$location.path('/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setAdditionalData/preview');			
	}

}])

.controller('SetDelimiterCtrl', ['$location','$rootScope','$scope','customHttp',function ($location,$rootScope,$scope,customHttp){	
	
	$scope.loading=false;
	$scope.businessPartnerEdit=true;
	$scope.businessPartnerText='';
	$scope.delimiterEdit=false;
	$scope.elementDelimiter='*';
	$scope.subElementDelimiter=':';
	$scope.segmentDelimiter='~';
	$scope.progressStyle={width:'83%'};	
	
	var progress=83;
	var progressLimit=90;
	var progressAnimationVariable;

	progressAnimationVariable=setInterval(progressAnimation,10);

	getHistory();

	function getHistory()
	{
		var businessPartnerText='';
		var elementDelimiter='';
		var subElementDelimiter='';
		var segmentDelimiter='';

		if(businessPartnerText=localStorage.getItem('businessPartnerText'))
		{	
			$scope.businessPartnerText=businessPartnerText;
			$scope.businessPartnerEdit=false;
		}
		if(elementDelimiter=localStorage.getItem('elementDelimiter'))
		{
			$scope.elementDelimiter=elementDelimiter;
		}
		if(subElementDelimiter=localStorage.getItem('subElementDelimiter'))
		{
			$scope.subElementDelimiter=subElementDelimiter;
		}
		if(segmentDelimiter=localStorage.getItem('segmentDelimiter'))
		{
			$scope.segmentDelimiter=segmentDelimiter;
		}
	}
	
	function progressAnimation()
	{
		progress++;
		$scope.progressStyle.width=progress+'%';
		document.getElementById('progressBar').style.width=progress.toString()+'%';
		if(progress>progressLimit)
		{
			clearInterval(progressAnimationVariable);
		}
	}

	$scope.enableBusinessPartnerEdit = function()
	{
		$scope.businessPartnerEdit =true;
	}

	$scope.enableDelimiterEdit = function()
	{
		$scope.delimiterEdit =true;
	}


	$scope.prev=function(){

		$location.path('/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/elementValue');	
	
	}

	$scope.next=function(){

		localStorage.setItem('businessPartnerText',$scope.businessPartnerText);
		localStorage.setItem('elementDelimiter',$scope.elementDelimiter);
		localStorage.setItem('subElementDelimiter',$scope.subElementDelimiter);
		localStorage.setItem('segmentDelimiter',$scope.segmentDelimiter);
		$location.path('/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setDelimiters/preview');
		
	}

}])

/*

	EDI Preview Controller

*/

.controller('EdiPreviewCtrl', ['$location','$rootScope','$scope','$http','customHttp',function ($location,$rootScope,$scope,$http,customHttp){	

	$scope.loading=false;
	$scope.progressStyle={width:'83%'};	
	$scope.dataRetrievalStatus="Start";
	$scope.agency='';
	$scope.version='';
	$scope.transactionSet='';
	$scope.segmentUsagePosition=[];
	$scope.segmentUsage=[];
	$scope.elementUsageDefs={};
	$scope.elementUsageGroups={};
	$scope.elementUsageValue={};
	$scope.elementDelimiter="*";
	$scope.segmentDelimiter="~";
	$scope.subElementDelimiter=":";
	$scope.display="";
	$scope.remoteSaveStatus=false;
	$scope.previewMode=0;

	var progress=90;
	var progressLimit=100;
	var progressAnimationVariable;
	var numberOfSegmentsRetrieved=0;
	var totalSegments=0;
	var remoteElementUsageValue={};

	progressAnimationVariable=setInterval(progressAnimation,10);

	var m='';
	if(m=localStorage.getItem('previewMode'))
	{
		$scope.previewMode=m;
	}


	getBusinessPartnerText();
	getAgency();
	getVersion();
	getTransactionSet();
	getSegmentUsageStub();
	getElementUsageDefs();
	getDelimiters();

	function getDelimiters()
	{
		var delimiter='';

		if(delimiter=localStorage.getItem('segmentDelimiter'))
		{
			$scope.segmentDelimiter=delimiter;
		}
		if(delimiter=localStorage.getItem('elementDelimiter'))
		{
			$scope.elementDelimiter=delimiter;
		}
		if(delimiter=localStorage.getItem('subElementDelimiter'))
		{
			$scope.subElementDelimiter=delimiter;
		}
	}

	function checkCompletion()
	{		
		if(numberOfSegmentsRetrieved==totalSegments)
		{
			console.log('ElementUsageDefs');
			console.log($scope.elementUsageDefs);
			console.log('ElementUsageDefsValue');
			console.log($scope.elementUsageValue);	
			createDisplay();		
		}
	}

	function createDisplay()
	{
		var display="";
		var a,b,c,x,y,z;
		var ctr=0;
		var elementValue=localStorage.getItem('elementValue');
		var max=0;
		var temp,temp1;

		console.log('elementValue');	
		elementValue=JSON.parse(elementValue);
		console.log(elementValue);

		for(x in $scope.segmentUsagePosition)
		{
			for(y in elementValue[$scope.segmentUsagePosition[x]])
			{
				display=display+$scope.segmentUsage[x]+$scope.elementDelimiter;

				for(z in elementValue[$scope.segmentUsagePosition[x]][y])
				{
					display=display+elementValue[$scope.segmentUsagePosition[x]][y][z];

					temp=$scope.elementUsageGroups[$scope.segmentUsagePosition[x]][z-1];
					temp1=$scope.elementUsageGroups[$scope.segmentUsagePosition[x]][z];

					if(temp==temp1&&temp1!=''&&temp1!=' ')
					{
						display=display+$scope.subElementDelimiter;	
					}
					else
					{
						display=display+$scope.elementDelimiter;
					}
				}

				display=display+$scope.segmentDelimiter+"\n";
			}
		}

		console.log('display');
		console.log(display);

		$scope.display=display;

		// 	max=0;			
		// 	for(a in $scope.elementUsageDefs[$scope.segmentUsagePosition[x]])
		// 	{
		// 		if(parseInt($scope.elementUsageDefs[$scope.segmentUsagePosition[x]][y])>max)
		// 		{
		// 			max=parseInt($scope.elementUsageDefs[$scope.segmentUsagePosition[x]][y]);
		// 			// console.log($scope.elementUsageDefs[$scope.segmentUsagePosition[x]][y]);
		// 		}
		// 	}

		// 	// console.log(x);
		// 	for(y in elementValue[$scope.segmentUsagePosition[x]])
		// 	{
		// 		// console.log(elementValue[segmentUsagePosition[x]][y]);
		// 		display=display+$scope.segmentUsage[x]+$scope.elementDelimiter;
		// 		ctr=0;

		// 		for(a=1;a<=max;a++)
		// 		{
		// 			display=display+elementValue[$scope.segmentUsagePosition[x]][y][a];

		// 			temp=$scope.elementUsageGroups[$scope.segmentUsagePosition[x]][a-1];
		// 			temp1=$scope.elementUsageGroups[$scope.segmentUsagePosition[x]][a];

		// 			if(a!=max)
		// 			{
		// 				if(temp==temp1&&temp1!=''&&temp1!=' ')
		// 				{
		// 					display=display+$scope.subElementDelimiter;	
		// 				}
		// 				else
		// 				{
		// 					display=display+$scope.elementDelimiter;
		// 				}
		// 			}

		// 		}

		// 		display=display+$scope.segmentDelimiter+"\n";
		// 	}
		// }


		// console.log('display');
		// console.log(display);

		// var display="";
		// var x,y;
		// var max=0;
		// var disEle={};
		// var presentGroup='';
		// var flag=0;
		// var temp;
		// var temp1;

		// console.log('group');
		// console.log($scope.elementUsageGroups);

		// for(x in $scope.segmentUsage)
		// {
		// 	display=display+$scope.segmentUsage[x]+$scope.elementDelimiter;
		// 	max=0;
			
		// 	for(y in $scope.elementUsageDefs[$scope.segmentUsagePosition[x]])
		// 	{
		// 		if(parseInt($scope.elementUsageDefs[$scope.segmentUsagePosition[x]][y])>max)
		// 		{
		// 			max=parseInt($scope.elementUsageDefs[$scope.segmentUsagePosition[x]][y]);
		// 			console.log($scope.elementUsageDefs[$scope.segmentUsagePosition[x]][y]);
		// 		}
		// 	}

		// 	console.log('max_'+max);

		// 	var ctr=0;

		// 	for(y=1;y<=max;y++)
		// 	{
		// 		if(y==parseInt($scope.elementUsageDefs[$scope.segmentUsagePosition[x]][ctr]))
		// 		{
		// 			display=display+$scope.elementUsageValue[$scope.segmentUsagePosition[x]][ctr];

		// 			ctr++;
		// 		}

		// 		temp=$scope.elementUsageGroups[$scope.segmentUsagePosition[x]][y-1];
		// 		temp1=$scope.elementUsageGroups[$scope.segmentUsagePosition[x]][y];

		// 		// if(temp==undefined||temp1==undefined||temp==''||temp==' '||temp!=temp1)
				
		// 		if(y!=max)
		// 		{
		// 			if(temp==temp1&&temp1!=''&&temp1!=' ')
		// 			{
		// 				display=display+$scope.subElementDelimiter;	
		// 			}
		// 			else
		// 			{
		// 				display=display+$scope.elementDelimiter;
		// 			}
		// 		}
		// 		// else
		// 		// {
		// 		// 	display=display+$scope.subElementDelimiter;
		// 		// }
		// 	}

		// 	display=display+$scope.segmentDelimiter+"\n";
		// }

		// $scope.display=display;

		// console.log('display');
		// console.log(display);
	}	

	function progressAnimation()
	{
		progress++;
		$scope.progressStyle.width=progress+'%';
		document.getElementById('progressBar').style.width=progress.toString()+'%';
		if(progress>progressLimit)
		{
			clearInterval(progressAnimationVariable);
		}
	}

	function getBusinessPartnerText()
	{
		var businessPartnerText='';
		if(businessPartnerText=localStorage.getItem('businessPartnerText'))
		{
			$scope.businessPartnerText=businessPartnerText;
			console.log('BusinessPartner');
			console.log($scope.businessPartnerText);
		}
		else
		{
			console.log('BusinessPartnertext not found in localStorage');
		}
	}

	function getAgency()
	{	
		var agencyStub='';
		if(agencyStub=localStorage.getItem('agency'))
		{
			$scope.agency=agencyStub;
			console.log('Agency');
			console.log($scope.agency);
		}
		else
		{
			console.error("Agency local Storage not found");		
		}
	}

	function getVersion()
	{
		var versionStub='';
		if(versionStub=localStorage.getItem('version'))
		{
			$scope.version=versionStub;
			console.log('Version');
			console.log($scope.version);
		}
		else
		{
			console.error("Version local Storage not found");		
		}		
	}	

	function getTransactionSet()
	{
		var transactionSetStub='';
		if(transactionSetStub=localStorage.getItem('transactionSet'))
		{
			$scope.transactionSet=transactionSetStub;
			console.log('transactionSet');
			console.log($scope.transactionSet);
		}
		else
		{
			console.error("Transaction Set local Storage not found");
		}
	}

	function getSegmentUsageStub()
	{
		var segmentUsageStub='';
		if(segmentUsageStub=localStorage.getItem('segmentPosition'))
		{
			segmentUsageStub=segmentUsageStub.split(',');
			$scope.segmentUsagePosition=segmentUsageStub;				
		}
		else
		{
			console.error("Segment Usage Position local Storage not found");
		}

		if(segmentUsageStub=localStorage.getItem('segmentUsage'))
		{
			segmentUsageStub=segmentUsageStub.split(',');
			$scope.segmentUsage=segmentUsageStub;				
		}
		else
		{
			console.error("Segment Usage local Storage not found");
		}

		totalSegments=$scope.segmentUsagePosition.length;
		console.log('segmentPosition');
		console.log($scope.segmentUsagePosition);
		console.log('segmentUsage');
		console.log($scope.segmentUsage);
	}

	function getElementUsageDefs()
	{
		var elementUsageDefs='';
		var elementGroups='';
		var x;

		for(x in $scope.segmentUsagePosition)
		{
			if(elementUsageDefs=localStorage.getItem('elementUsageDefs:'+$scope.segmentUsagePosition[x]))
			{
				elementGroups=localStorage.getItem('elementUsageDefsGroup:'+$scope.segmentUsagePosition[x])
				
				numberOfSegmentsRetrieved++;
				$scope.elementUsageDefs[$scope.segmentUsagePosition[x]]=elementUsageDefs.split(',');
				$scope.elementUsageGroups[$scope.segmentUsagePosition[x]]=elementGroups.split(',');
				$scope.elementUsageValue[$scope.segmentUsagePosition[x]]=localStorage.getItem('elementUsageDefsValue:'+$scope.segmentUsagePosition[x]).split(',');
			}
			else
			{		
				getMandatoryElements($scope.segmentUsage[x],$scope.segmentUsagePosition[x]);		
				console.log('ElementUsage not found');
			}
		}

		console.log('elementUsageDefs');
		console.log($scope.elementUsageDefs);
		console.log('elementUsageDefsValue');
		console.log($scope.elementUsageValue);

		checkCompletion();

	}

	function getMandatoryElements(x,segmentPosition)
	{
		var z;
		var params;
		params="agency="+$scope.agency+"&version="+$scope.version+"&segmentId="+x	;

		customHttp.request(params,'/api/elementUsageDefs/get','POST',function(data)
		{
			if(data.status==true)
			{
				$scope.elementUsageGroups[segmentPosition]=[];												

				for(z in data.data)
				{
					$scope.elementUsageGroups[segmentPosition].push(data.data[z]['GroupRequirementDesignatorID']);

					if(data.data[z]['RequirementDesignator']=='M')
					{
						if($scope.elementUsageDefs[segmentPosition]==undefined)
						{
							$scope.elementUsageDefs[segmentPosition]=[];
							$scope.elementUsageValue[segmentPosition]=[];	
							// $scope.elementUsageDefs[segmentPosition][data.data[z]['Position']]=data.data[z];
							$scope.elementUsageDefs[segmentPosition].push(data.data[z]['Position']);
							$scope.elementUsageValue[segmentPosition].push('XXXXX');
						}
						else
						{
							$scope.elementUsageDefs[segmentPosition].push(data.data[z]['Position']);
							$scope.elementUsageValue[segmentPosition].push('XXXXX');						
							$scope.elementUsageGroups[segmentPosition].push(data.data[z]['GroupRequirementDesignatorID']);							
							// $scope.elementUsageDefs[segmentPosition][data.data[z]['Position']]=data.data[z];
						}
					}
				}
				numberOfSegmentsRetrieved++;
				checkCompletion();
			}
			else
			{
				console.log("Error in fetching Element "+segmentUsageStub[numberOfSegmentsRetrieved]+":"+elementUsageDefs[segmentUsageStub[numberOfSegmentsRetrieved]][numberOfElementsRetrieved]);
			}
		});
	}

	function getElementUsageStub()
	{
		var x;
		numberOfElements=0;
		numberOfSegmentsRetrieved=0;
		//console.log("Element Usage Defs");
		for(x in segmentUsageStub)
		{
			if(elementUsageDefsStub[segmentUsageStub[x]]=localStorage.getItem('elementUsageDefs:'+segmentUsageStub[x]))
			{
				//Remote Logging of elements
				remoteElementUsageDefs[segmentUsageStub[x]]=elementUsageDefsStub[segmentUsageStub[x]];

				elementUsageStubStatus[segmentUsageStub[x]]=true;
				elementUsageDefsStub[segmentUsageStub[x]]=elementUsageDefsStub[segmentUsageStub[x]].split(',');
				$scope.numberOfElementsInSegment[segmentUsageStub[x]]=elementUsageDefsStub[segmentUsageStub[x]].length;
				numberOfElements+=elementUsageDefsStub[segmentUsageStub[x]].length;
				numberOfSegmentsRetrieved++;
			}
			else
			{
				getMandatoryElements($scope.segmentUsage[segmentUsageStub[x]]['SegmentID'],segmentUsageStub[x]);
			}
		}		
	}

	$scope.remoteSave=function()
	{					

		var params="BusinessPartner="+$scope.businessPartnerText;
		params=params+"&Agency="+localStorage.getItem('agency')+"&Version="+localStorage.getItem('version');
		params=params+"&TransactionSet="+localStorage.getItem('transactionSet');
		params=params+"&SegmentPosition="+localStorage.getItem('segmentPosition');
		params=params+"&SegmentID="+localStorage.getItem('segmentUsage');
		params=params+"&ElementUsageDefs="+JSON.stringify($scope.elementUsageDefs);
		params=params+"&ElementUsageValue="+JSON.stringify($scope.elementUsageValue);
		params=params+"&ElementUsageGroups="+JSON.stringify($scope.elementUsageGroups);
		params=params+"&Code="+'{}';
		params=params+"&Header="+'';
		params=params+"&Footer="+'';
		params=params+"&SegmentFooter="+'{}';
		params=params+"&FileType=1";
		params=params+"&FileVersion=1";
		params=params+"&SegmentDelimiter="+localStorage.getItem('segmentDelimiter');
		params=params+"&ElementDelimiter="+localStorage.getItem('elementDelimiter');
		params=params+"&SubElementDelimiter="+localStorage.getItem('subElementDelimiter');

		customHttp.request(params,'/api/ediLog/create','POST',function(data){
			if(data.status)
			{
				$scope.remoteSaveStatus=true;
			}
			else
			{
				console.error(data.message);
			}
		});		

		console.log(params);
	}

	$scope.saveEdi=function(){

		var fi=$scope.display;
		var fileName=$scope.businessPartnerText+"_"+$scope.version+"_"+$scope.transactionSet+".TXT";
		var file = new Blob([fi], {type: 'text'});
   		var fileURL = URL.createObjectURL(file);
		saveAs(file, fileName);
	}

	$scope.prev=function(){

		if($scope.previewMode==0)
		{
			$location.path('/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setDelimiters');
		}
		else
		{
			$location.path('/searchSpec');	
		}
	}

}])

/*

	Preview Controller

*/


.controller('PreviewCtrl', ['$location','$rootScope','$scope','$http','customHttp',function ($location,$rootScope,$scope,$http,customHttp){	
	
	$scope.progressStyle={width:'83%'};
	$scope.agency;
	$scope.version;
	$scope.transactionSet;
	$scope.segmentUsage={};
	$scope.elementUsageDefs={};
	$scope.elementUsageGroups={};
	$scope.code={};
	$scope.loading=false;
	$scope.dataRetrievalStatus="Start";
	$scope.numberOfHeadingSegments=0;
	$scope.numberOfDetailSegments=0;
	$scope.numberOfSummarySegments=0;
	$scope.numberOfNoneSegments=0;
	$scope.numberOfFooterSegments=0;
	$scope.numberOfElementsInSegment={};
	$scope.headingText='';
	$scope.footerText='';
	$scope.businessPartnerText='';
	$scope.segmentText={};
	$scope.remoteSaveStatus=false;
	$scope.previewMode=0;
	var dataRetrievalStatus="Start";
	var agencyStub;
	var versionStub;
	var transactionSetStub;
	var segmentUsageStub=[];
	var elementUsageDefsStub={};
	var progress=90;
	var progressLimit=100;
	var progressAnimationVariable;
	var params;
	var numberOfSegments=0;
	var numberOfSegmentsRetrieved=0;
	var numberOfElements=0;
	var numberOfElementsRetrieved=0;
	var numberOfSegmentsForCode=0;
	var numberOfSegmentsRetrievedByCode=0;
	var presentLoopId='';
	var elementUsageStubStatus={};
	var checkingFunction;
	var initialFooterText='';
	var initialSegmentText={};
	var fileName='';
	var remoteCode={};
	var remoteElementUsageDefs={};
	var fileVersion=1;

	var m;

	if(m=localStorage.getItem('previewMode'))
	{
		$scope.previewMode=m;
	}

	progressAnimationVariable=setInterval(progressAnimation,10);
	$scope.loading=true;
	$scope.dataRetrievalStatus="Agency";

	getFileVersion();
	getHeadingText();
	getFooterText();
	getBusinessPartnerText();
	getAgency();

	function getFileVersion()
	{
		var fv=localStorage.getItem('fileVersion');

		if(fv!=null)
		{
			fileVersion=fv;
		}
	}

	function getHeadingText()
	{
		var headingText='';
		if(headingText=localStorage.getItem('headingText'))
		{
			$scope.headingText=headingText;
			console.log('headingText '+$scope.headingText);
		}
		else
		{
			console.log('Heading text not found');
		}
	}

	function getFooterText()
	{
		var footerText='';
		if(footerText=localStorage.getItem('footerText'))
		{
			initialFooterText=footerText;
			initialFooterText=initialFooterText.replace('Semantics:','$Semantics:$');
			initialFooterText=initialFooterText.replace('Comments:','$Comments:$')
			initialFooterText=initialFooterText.replace('Notes:','$Notes:$');
			initialFooterText=initialFooterText.replace('Syntax:','$Syntax:$');
			footerText=footerText.replace('Semantics:','<br><b><u>Semantics:</u></b><br>');
			footerText=footerText.replace('Comments:','<br><b><u>Comments:</u></b><br>')
			footerText=footerText.replace('Notes:','<br><b><u>Notes:</u></b><br>');
			footerText=footerText.replace('Syntax:','<br><b><u>Syntax:</u></b><br>');
			$scope.footerText=footerText;
			console.log('footerText '+$scope.footerText);
		}
		else
		{
			console.log('Footer text not found');
		}	
	}

	function getBusinessPartnerText()
	{
		var businessPartnerText='';
		if(businessPartnerText=localStorage.getItem('businessPartnerText'))
		{
			$scope.businessPartnerText=businessPartnerText;
		}
		else
		{
			console.log('BusinessPartnertext not found in localStorage');
		}
	}

	function progressAnimation()
	{
		progress++;
		$scope.progressStyle.width=progress+'%';
		document.getElementById('progressBar').style.width=progress.toString()+'%';
		if(progress>progressLimit)
		{
			clearInterval(progressAnimationVariable);
		}
	}

	function getAgency()
	{	
		if(agencyStub=localStorage.getItem('agency'))
		{
			params="agency="+agencyStub;
			customHttp.request(params,'/api/agency/get','POST',function(data){
				if(data.status==true)
				{
					$scope.agency=data.data[0];
					//console.log("Agency");
					//console.log($scope.agency);
					$scope.dataRetrievalStatus="Version";
					getVersion();
				}
				else
				{
					//console.log("Error in fetching agencies");
				}
			});
		}
		else
		{
			console.error("Agency local Storage not found");		
		}
	}

	function getVersion()
	{
		if(versionStub=localStorage.getItem('version'))
		{
			params="agency="+agencyStub+"&version="+versionStub;
			customHttp.request(params,'/api/version/get','POST',function(data){
				if(data.status==true)
				{
					$scope.version=data.data[0];
					//$scope.version.Version=parseInt()
					//console.log("Version");
					//console.log($scope.version);
					$scope.dataRetrievalStatus="Transaction Set";
					;
					getTransactionSet();
				}
				else
				{
					console.log("Error in fetching version");
				}
			});
		}
		else
		{
			console.error("Version local Storage not found");		
		}		
	}	

	function getTransactionSet()
	{
		if(transactionSetStub=localStorage.getItem('transactionSet'))
		{
			params="agency="+agencyStub+"&version="+versionStub+"&transactionSet="+transactionSetStub;
			customHttp.request(params,'/api/transactionSet/get','POST',function(data){
				if(data.status==true)
				{
					$scope.transactionSet=data.data[0];
					//console.log("Transaction Set");
					//console.log($scope.transactionSet);
					$scope.dataRetrievalStatus="Segment";
					getSegmentUsageStub();
				}
				else
				{
					console.log("Error in fetching Transaction Set");
				}
			});
		}
		else
		{
			console.error("Transaction Set local Storage not found");
		}
	}

	function getSegmentUsageStub()
	{
		if(segmentUsageStub=localStorage.getItem('segmentPosition'))
		{
			segmentUsageStub=segmentUsageStub.split(',');
			numberOfSegments=segmentUsageStub.length;
			numberOfSegmentsForCode=numberOfSegments;
			//console.log('Segment Usage');
			getSegmentText();
			getSegmentUsageParallel();
		//	getCodes();				
		}
		else
		{
			console.error("Segment Usage local Storage not found");
		}
	}

	function getSegmentText()
	{
		var segmentText;
		var tempSegmentText;
		var x;
		for(x in segmentUsageStub)
		{
			$scope.segmentText[segmentUsageStub[x]]='';
			if(segmentText=localStorage.getItem('segmentText'+segmentUsageStub[x]))
			{
				tempSegmentText=segmentText;
				// segmentText='<b>'+segmentText;
				segmentText=segmentText.replace('\n','<br>');
				// segmentText=segmentText.replace(':','</b>:<br>');
				
				tempSegmentText=tempSegmentText.replace('Semantics:','$Semantics:$');
				tempSegmentText=tempSegmentText.replace('Comments:','$Comments:$')
				tempSegmentText=tempSegmentText.replace('Notes:','$Notes:$');
				tempSegmentText=tempSegmentText.replace('Syntax:','$Syntax:$');

				segmentText=segmentText.replace('Semantics:','<br><b><u>Semantics:</u></b><br>');
				segmentText=segmentText.replace('Comments:','<br><b><u>Comments:</u></b><br>')
				segmentText=segmentText.replace('Notes:','<br><b><u>Notes:</u></b><br>');
				segmentText=segmentText.replace('Syntax:','<br><b><u>Syntax:</u></b><br>');
				
				initialSegmentText[segmentUsageStub[x]]=tempSegmentText;
				$scope.segmentText[segmentUsageStub[x]]=segmentText;
			}
			else
			{
				console.log('Segment text not found');
			}
		}
	}

	function getSegmentUsageParallel()
	{
		var x;
		for(x in segmentUsageStub)
		{
			params="agency="+agencyStub+"&version="+versionStub+"&transactionSet="+transactionSetStub+"&segment="+segmentUsageStub[x];
			customHttp.request(params,'/api/segmentUsage/getFromPosition','POST',function(data)
			{
				if(data.status==true)
				{
					numberOfSegmentsRetrieved++;
					//console.log(numberOfSegmentsRetrieved);
					
					$scope.segmentUsage[data.data[0]['Position']]=data.data[0];	
					$scope.segmentUsage[data.data[0]['Position']]['Description']=data.description;													
					$scope.numberOfElementsInSegment[data.data[0]['Position']]=0;

					if(data.data[0]['Section']=='H')
					{
						$scope.numberOfHeadingSegments++;
					}
					else if(data.data[0]['Section']=='D')
					{
						$scope.numberOfDetailSegments++;
					}
					else if(data.data[0]['Section']=='S')
					{
						$scope.numberOfSummarySegments++;
					}
					else if(data.data[0]['Section']=='')
					{
						$scope.numberOfNoneSegments++;
					}
					else if(data.data[0]['Section']=='F')
					{
						$scope.numberOfFooterSegments++;
					}

					if(numberOfSegmentsRetrieved<numberOfSegments)
					{
					//	getSegmentUsage();
					}
					else
					{
						presentLoopId='';
						for(x in $scope.segmentUsage)
						{
							$scope.segmentUsage[x]['LoopStart']=false;
							if($scope.segmentUsage[x]['LoopID']!=presentLoopId)
							{
								presentLoopId=$scope.segmentUsage[x]['LoopID'];
								if(presentLoopId!='')
								{
									//console.log("Setting loop start on "+$scope.segmentUsage[x]['Position'])
									$scope.segmentUsage[x]['LoopStart']=true;
								}
							}
						}
						//console.log('dataRetrievalStatus : elementUsage');
						$scope.dataRetrievalStatus="Element Usage";
						;
						//console.log($scope.segmentUsage);
						getElementUsageStub();
					}
				}
				else
				{
					console.log("Error in fetching Segment Usage");
				}
			});
		}
	}

	function getElementUsageStub()
	{
		var x;
		var elementGroups='';
		numberOfElements=0;
		numberOfSegmentsRetrieved=0;
		//console.log("Element Usage Defs");
		for(x in segmentUsageStub)
		{
			if(elementUsageDefsStub[segmentUsageStub[x]]=localStorage.getItem('elementUsageDefs:'+segmentUsageStub[x]))
			{
				elementGroups=localStorage.getItem('elementUsageDefsGroup:'+segmentUsageStub[x]);
				$scope.elementUsageGroups[segmentUsageStub[x]]=elementGroups.split(',');

				//Remote Logging of elements
				remoteElementUsageDefs[segmentUsageStub[x]]=elementUsageDefsStub[segmentUsageStub[x]];

				elementUsageStubStatus[segmentUsageStub[x]]=true;
				elementUsageDefsStub[segmentUsageStub[x]]=elementUsageDefsStub[segmentUsageStub[x]].split(',');
				$scope.numberOfElementsInSegment[segmentUsageStub[x]]=elementUsageDefsStub[segmentUsageStub[x]].length;
				numberOfElements+=elementUsageDefsStub[segmentUsageStub[x]].length;
				numberOfSegmentsRetrieved++;
			}
			else
			{
				//console.log("Error in retrieving elements from local Storage");
				//console.log('Retrieve mandatory elements :'+segmentUsageStub[x]);
				numberOfElements=numberOfElements+1000;
				elementUsageStubStatus[segmentUsageStub[x]]=false;
				//console.log($scope.segmentUsage[segmentUsageStub[x]]['SegmentID']);
				getMandatoryElements($scope.segmentUsage[segmentUsageStub[x]]['SegmentID'],segmentUsageStub[x]);
			}
		}
		//if(numberOfSegmentsRetrieved==numberOfSegments)
		{
			numberOfSegmentsRetrieved=0;
			numberOfElementsRetrieved=0;
			numberOfSegments=segmentUsageStub.length;
			//console.log(elementUsageDefsStub);

			checkingFunction=setInterval(checkElementRetrievalCompletion,2000);

			getElementUsageParallel();
		}		
	}

	function checkElementRetrievalCompletion()
	{
		//console.log("Number of elements "+numberOfElements+" numberOfElementsRetrieved "+numberOfElementsRetrieved);
		if(numberOfElements==numberOfElementsRetrieved)
		{
			$scope.dataRetrievalStatus ="Codes";
			;
			//console.log($scope.elementUsageDefs);						
			//console.log("Element Retrieeval completed");
			window.clearInterval(checkingFunction);
			getCodesParallel();
		}
	}

	function getMandatoryElements(x,segmentPosition)
	{
		var z;

		$scope.elementUsageGroups[segmentPosition]=[];
		params="agency="+agencyStub+"&version="+versionStub+"&segmentId="+x	;
		customHttp.request(params,'/api/elementUsageDefs/get','POST',function(data)
		{
			numberOfElements=numberOfElements-1000;
			if(data.status==true)
			{
				for(z in data.data)
				{
					$scope.elementUsageGroups[segmentPosition].push(data.data[z]['GroupRequirementDesignatorID']);

					if(data.data[z]['RequirementDesignator']=='M')
					{
						data.data[z]['SegmentPosition']=segmentPosition;
						numberOfElements++;
						$scope.numberOfElementsInSegment[segmentPosition]++;
						if($scope.elementUsageDefs[segmentPosition]==undefined)
						{
							$scope.elementUsageDefs[segmentPosition]={};
							$scope.elementUsageDefs[segmentPosition][data.data[z]['Position']]=data.data[z];
						}
						else
						{
							$scope.elementUsageDefs[segmentPosition][data.data[z]['Position']]=data.data[z];
						}
						//console.log($scope.elementUsageDefs);
						numberOfElementsRetrieved++;
					}
				}
			}
			else
			{
				console.log("Error in fetching Element "+segmentUsageStub[numberOfSegmentsRetrieved]+":"+elementUsageDefs[segmentUsageStub[numberOfSegmentsRetrieved]][numberOfElementsRetrieved]);
			}
		});
	}

	function getElementUsageParallel()
	{
		var x,y,z;
		//console.log('Element uSage stub status ');
		//console.log(elementUsageStubStatus);
		for(x in segmentUsageStub)
		{
			if(elementUsageStubStatus[segmentUsageStub[x]]==true)
			{
				$scope.elementUsageDefs[segmentUsageStub[x]]={};		

				for(y in elementUsageDefsStub[segmentUsageStub[x]])
				{
					params="agency="+agencyStub+"&version="+versionStub+"&segmentId="+$scope.segmentUsage[segmentUsageStub[x]]['SegmentID']+'&position='+elementUsageDefsStub[segmentUsageStub[x]][y]+'&segmentPosition='+segmentUsageStub[x];
					customHttp.request(params,'/api/elementUsageDefs/getFromPosition','POST',function(data)
					{
						if(data.status==true)
						{
							for(z in data.data)
							{
								data.data[z]['SegmentPosition']=data.segmentPosition;
								$scope.numberOfElementsInSegment[data.segmentPosition]++;
								$scope.elementUsageDefs[data.segmentPosition][data.data[z]['Position']]=data.data[z];
								numberOfElementsRetrieved++;
							}
							//console.log(segmentUsageStub[x]+" "+elementUsageDefsStub[segmentUsageStub[x]]+" Element : "+numberOfElementsRetrieved+"/"+numberOfElements);						
							if(numberOfElementsRetrieved==numberOfElements)
							{
								//console.log($scope.elementUsageDefs);
							//	getCodesParallel();
							}
						}
						else
					{
							console.log("Error in fetching Element "+segmentUsageStub[numberOfSegmentsRetrieved]+":"+elementUsageDefs[segmentUsageStub[numberOfSegmentsRetrieved]][numberOfElementsRetrieved]);
						}
					});
				
				}
			}
		}							
	}

	function getCodesParallel(){
		var data='';
		var codeParts;
		var x,y,z;
		var codeSide;
		var eleSide;
		var mainPart;
		var ctr=0;
		numberOfSegmentsRetrieved=0;
	
		for(x in segmentUsageStub)
		{
			if(data=localStorage.getItem('code'+segmentUsageStub[x]))
			{
				//Remote code logging
				remoteCode[segmentUsageStub[x]]=data;

				$scope.code[segmentUsageStub[x]]={};
				
				data=data.split('%');

				console.log('data');
				console.log(data);
				for(y in data)
				{
					codeParts=data[y].split('#')
					console.log("data[y]");
					console.log(codeParts);
					eleSide=codeParts[0];
					codeSide=codeParts[1].split('$');
					$scope.code[segmentUsageStub[x]][eleSide]=[];
					ctr=0;
					for(y in codeSide)
					{
						$scope.code[segmentUsageStub[x]][eleSide][ctr]={};						
						mainPart=codeSide[y].split('@');
						$scope.code[segmentUsageStub[x]][eleSide][ctr]={'value':mainPart[0],'description':mainPart[1]};
						ctr++;	
					}	
				}
				console.log("Code from localStorage");
				console.log($scope.code);
			}
			else
			{
				console.log("Code not Found in local Storage");
			}

			if(data=localStorage.getItem('customCode'+segmentUsageStub[x]))
			{
				$scope.code[segmentUsageStub[x]]=$scope.code[segmentUsageStub[x]]=== undefined ? {} : $scope.code[segmentUsageStub[x]];
				data = data.split('%');

				for(y in data)
				{
					codeParts=data[y].split('#');
					eleSide = codeParts[0];
					codeSide = codeParts[1].split('$');
					$scope.code[segmentUsageStub[x]][eleSide] = $scope.code[segmentUsageStub[x]][eleSide]===undefined ? [] : $scope.code[segmentUsageStub[x]][eleSide];
					for(z in codeSide)
					{
						mainPart = codeSide[z].split('@');
						$scope.code[segmentUsageStub[x]][eleSide].push( { 'value':mainPart[0],
																		   'description': mainPart[1] } );
					}
				}
				console.log($scope.code);
			}
			else
			{
				console.log("Custom code not Found in Local Storage");
			}
		}
		//console.log("code");
		//console.log($scope.code);
		wrap();
	}

	function wrap()
	{
		var x;
		console.log("wrap");
		console.log($scope.code);
		$scope.loading=false;
		$scope.dataRetrievalStatus="Completed";
		$scope.$apply();
	}

	$scope.prev = function ()
	{
		if($scope.previewMode==0)
		{
			$location.path('/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setAdditionalData');
		}
		else
		{
			$location.path('/searchSpec');	
		}
	}

	$scope.remoteSave=function()
	{					

		var params="BusinessPartner="+$scope.businessPartnerText;
		params=params+"&Agency="+localStorage.getItem('agency')+"&Version="+localStorage.getItem('version');
		params=params+"&TransactionSet="+localStorage.getItem('transactionSet');
		params=params+"&SegmentPosition="+localStorage.getItem('segmentPosition');
		params=params+"&SegmentID="+localStorage.getItem('segmentUsage');
		params=params+"&ElementUsageDefs="+JSON.stringify(remoteElementUsageDefs);		
		params=params+"&ElementUsageValue={}";
		params=params+"&ElementUsageGroups="+JSON.stringify($scope.elementUsageGroups);
		params=params+"&Code="+JSON.stringify(remoteCode);
		params=params+"&Header="+$scope.headingText;
		params=params+"&Footer="+$scope.footerText;
		params=params+"&SegmentFooter="+JSON.stringify(initialSegmentText);
		params=params+"&FileType=0";
		params=params+"&FileVersion="+fileVersion;
		params=params+"&SegmentDelimiter=~";
		params=params+"&ElementDelimiter=*";
		params=params+"&SubElementDelimiter=:";

		customHttp.request(params,'/api/ediLog/create','POST',function(data){
			if(data.status)
			{
				$scope.remoteSaveStatus=true;
			}
			else
			{
				console.error(data.message);
			}
		});		

		console.log(params);
	}

	$scope.print = function()
	{		
		// window.print();
		console.log('Printing');
		
		var tempCode,x,y,z;
		var tempCode={};
		var tparams={};

		var fileName=$scope.businessPartnerText+'_'+$scope.transactionSet['TransactionSet']+'_'+$scope.version['Version'];

		//Adding Version and transactionSet information
		params="version="+$scope.version['Version']+"&transactionSet="+$scope.transactionSet['TransactionSet']+"&transactionDescription="+$scope.transactionSet['Description']+"&transactionFunctionalGroup="+$scope.transactionSet['FunctionalGroupID'];
		//Adding headingText and footerText and businessPartnerText
		params=params+"&headingText="+$scope.headingText+"&footerText="+initialFooterText+"&businessPartnerText="+$scope.businessPartnerText;
		//Adding segments
		params=params+"&numberOfHeadingSegments="+$scope.numberOfHeadingSegments;
		params=params+"&numberOfDetailSegments="+$scope.numberOfDetailSegments;
		params=params+"&numberOfSummarySegments="+$scope.numberOfSummarySegments;
		params=params+"&segmentUsage="+JSON.stringify($scope.segmentUsage);

		//Adding Elements
		params=params+"&numberOfElementsInSegment="+JSON.stringify($scope.numberOfElementsInSegment);
		params=params+"&elementUsageDefs="+JSON.stringify($scope.elementUsageDefs);
		params=params+"&segmentText="+JSON.stringify(initialSegmentText);
		
		for(x in $scope.code)
		{
			tempCode[x]={};
			for(y in $scope.code[x])
			{
				tempCode[x][y]={};
				for(z in $scope.code[x][y])
				{
					tempCode[x][y][z]={};
					tempCode[x][y][z]=$scope.code[x][y][z];
					// console.log($scope.code[x][y][z])
				}
			}
		}

		//Adding Code
		params=params+"&code="+JSON.stringify(tempCode);

		tparams.version=$scope.version['Version'];
		tparams.transactionSet=$scope.transactionSet['TransactionSet'];
		tparams.transactionDescription=$scope.transactionSet['Description'];
		tparams.transactionFunctionalGroup=$scope.transactionSet['FunctionalGroupID'];		
		tparams.headingText=$scope.headingText;
		tparams.footerText=initialFooterText;
		tparams.businessPartnerText=$scope.businessPartnerText;
		tparams.numberOfHeadingSegments=$scope.numberOfHeadingSegments;
		tparams.numberOfDetailSegments=$scope.numberOfDetailSegments;
		tparams.numberOfSummarySegments=$scope.numberOfSummarySegments;
		tparams.segmentUsage=JSON.stringify($scope.segmentUsage);
		tparams.numberOfElementsInSegment=JSON.stringify($scope.numberOfElementsInSegment);
		tparams.elementUsageDefs=JSON.stringify($scope.elementUsageDefs);
		tparams.segmentText=JSON.stringify(initialSegmentText);
		tparams.code=JSON.stringify(tempCode);

		console.log(tparams);

		$http.post('/api/pdf/create',tparams, {responseType:'arraybuffer'})
       		.success(function (data) {
           		var file = new Blob([data], {type: 'application/pdf'});
           		var fileURL = URL.createObjectURL(file);
        		if(fileVersion>1)
        		{
        			saveAs(file, fileName+'_'+(fileVersion)+'.pdf');
           		}
           		else
           		{
           			saveAs(file, fileName+'.pdf');	
           		}
           		//window.open(fileURL);
    	});
	}
}])
