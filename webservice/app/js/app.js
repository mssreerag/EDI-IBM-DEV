'use strict';

var cerebrumApp = angular.module('ediCreatorApp', ['ui.router', 'ngCookies', 'ngSanitize', 'ui.select','nvd3ChartDirectives']);

cerebrumApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider){
	
	$urlRouterProvider.otherwise('/login');
	$locationProvider.html5Mode(true);

	$stateProvider


// ********************EDI***************************
//Home
		.state('login', {
			url: '/login',
			templateUrl: '/views/home/login.html',
			controller: 'LoginCtrl'
		})

		.state('home', {
			url: '/home',
			templateUrl: '/views/home/index.html',
			controller: 'HomeCtrl'
		})
/*
	Create EDI Guide
*/
		//select Agency TODO : Change Names
		.state('selectAgencyAndVersion', {
			url: '/edi/agency',
			templateUrl: '/views/createEDI/selectAgencyAndVersion.html',
			controller: 'AgencyAndVersionCtrl'
		})

		//select Version
		.state('selectVersion',{
			url: '/edi/agency/version',
			templateUrl: '/views/createEDI/selectVersion.html',
			controller: 'VersionCtrl'	
		})

		//select TransactionSet
		.state('selectTransactionSet',{
			url: '/edi/agency/version/transactionSet',
			templateUrl: '/views/createEDI/selectTransactionSet.html',
			controller: 'TransactionSetCtrl'	
		})

		//select SegmentUsage
		.state('selectSegmentUsage',{
			url: '/edi/agency/version/transactionSet/segmentUsage',
			templateUrl: '/views/createEDI/selectSegmentUsage.html',
			controller: 'SegmentUsageCtrl'	
		})

		//select ElementUsageDefs
		.state('selectElementUsageDefs',{
			url: '/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs',
			templateUrl: '/views/createEDI/selectElementUsageDefs.html',
			controller: 'ElementUsageDefsCtrl'	
		})

		//Set Additional Data
		.state('setAdditionalData',{
			url: '/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setAdditionalData',
			templateUrl: '/views/createEDI/setAdditionalData.html',
			controller: 'SetAdditionalDataCtrl'	
		})

		//Preview document
		.state('previewDocument',{
			url: '/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setAdditionalData/preview',
			templateUrl: '/views/createEDI/previewDocument.html',
			controller: 'PreviewCtrl'	
		})
/*
	
	Create edi

*/
		.state('setElementValues',{
			url: '/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/elementValue',
			templateUrl: '/views/createEDI/elementUsageDefsValue.html',
			controller: 'ElementUsageDefsValueCtrl'	
		})

		.state('setDelimiters',{
			url: '/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setDelimiters',
			templateUrl: '/views/createEDI/setDelimiters.html',
			controller: 'SetDelimiterCtrl'	
		})

		.state('ediPreviewDocument',{
			url: '/edi/agency/version/transactionSet/segmentUsage/elementUsageDefs/setDelimiters/preview',
			templateUrl: '/views/createEDI/previewEDI.html',
			controller: 'EdiPreviewCtrl'	
		})

/*
	
	Search

*/
		.state('searchEdiSpec',{
			url: '/searchSpec',
			templateUrl: '/views/searchSpec/search.html',
			controller: 'SearchCtrl'	
		})
/*

	Report
		
*/
		.state('report',{
			url: '/report',
			templateUrl: '/views/report/report.html',
			controller: 'ReportCtrl'	
		})
	

});