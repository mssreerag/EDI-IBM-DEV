// BASE SETUP
// ==============================================

var express = require('express');
var app 	= express();
var router	= express.Router();
var port    = process.env.PORT || 3600;

// Middlewares
var morgan 			= require('morgan');
var bodyParser 		= require('body-parser');
var methodOverride 	= require('method-override');
var cookieParser 	= require('cookie-parser');
var session 		= require('express-session');
// var favicon			= require('serve-favicon');
var errorhandler	= require('errorhandler');
var ejs				= require('ejs');
var dbconnection 	= require('./config/database.js')
var sessionConfig	= require('./config/session.js')

var routes 			= require('./routes');
var http 			= require('http');
var path 			= require('path');
var api 			= require('./api');
var multer 			= require('multer');
var MongoStore		= require('connect-mongo')(session);
//var material_icon 	= require('material-design-icons');

// CONFIGURATION
// ==============================================
app.set('view engine', 'ejs');
app.engine('html',ejs.renderFile);

// app.use(favicon('./app/favicon.ico'));				// Use the favicon
app.use('/fonts',express.static(__dirname+'/node_modules/material-design-icons/iconfont'));   // set the static | files location /app/img will be /img for users
app.use(express.static(__dirname + '/app'));		// set the static | files location /app/img will be /img for users
app.use(morgan('dev'));								// log every request to the console
app.use(bodyParser.json());							// parse application/json
app.use(methodOverride());							// simulate DELETE and PUT
app.use(cookieParser());							// parse cookies
app.use(session({
	secret: '4qewWLlCpAB8T2K',
	saveUninitialized : true,
	resave : true,
	store : new MongoStore({ 	//using mongo-connect features
		url: dbconnection.url,
		ttl: sessionConfig.ttl,
	//	autoRemove: 'disabled',
		clear_interval: -1
	})
}))

app.use(bodyParser.urlencoded({						// parse application/x-www-form-urlencoded
  extended: true,
  uploadDir: './EDIFiles/temp'
}));
//app.use(multer({ dest: './EDIFiles/'})) 				// For handling multipart/form-data

app.use(multer({dest:'./EDIFiles/'}).single('file'));		//For handing multipart/form-data

if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler());
}
	
// ROUTES
// ==============================================
//app.use('/',router);
//routes for api
app.get('/api', api.index);

//User api paths
app.post('/api/user/authenticate',api.authenticate);
app.post('/api/user/session',api.getSession);
app.post('/api/user/logout',api.clearSession);

app.post('/api/agency/get',api.getAgency); //get Agency
//Send Post request to /api/getAgency
//with parameters 
// * agency
app.post('/api/agency/getAll',api.getAllAgency); // get All Agency

app.post('/api/version/get',api.getVersion);//get Version
//Send Post request to /api/getVersion with parameters 
// * agency
// * version
app.post('/api/version/getAll',api.getAllVersion);//get All Version

app.post('/api/transactionSet/get',api.getTransactionSet);//get TransactionSet
//Send post request to api/getTransactionSet with parameters
// * agency
// * version
// * transactionSet
app.post('/api/transactionSet/getAll',api.getAllTransactionSet);//get All TransactionSet

app.post('/api/segmentDescription/get',api.getSegmentDescription);

app.post('/api/segmentUsage/get',api.getSegmentUsage);//get SegmentUsage
//Send Post request to /api/getSegmentUsage with parameters
// * agency
// * version
// * transactionSet
// * segment
app.post('/api/segmentUsage/getFromPosition',api.getSegmentUsageFromPosition);//get SegmentUsage from position
app.post('/api/segmentUsage/getAll',api.getAllSegmentUsage);//get All SegmentUsage

app.post('/api/elementUsageDefs/get',api.getElementUsageDefs);//get Element Usage Defs
//Send POST request to /api/getElementUsageDefs with parameters
// * agency
// * version
// * segmentId
// get list of ElementUsageDefs with position being the ordering parameter
app.post('/api/elementUsageDefs/getFromPosition',api.getElementUsageDefsFromPosition);
app.post('/api/elementUsageDefs/getWithCode',api.getElementUsageDefsWithCode);
app.post('/api/elementUsageDefs/getMandatoryElementStatus',api.getMandatoryElementStatus);

app.post('/api/code/get',api.getCode);//get Code*

app.post('/api/pdf/create',api.getPdf);//Get pdf file

app.post('/api/ediLog/create',api.logEdiGuideCreation);
app.post('/api/ediLog/get',api.getEdiGuideLog);
app.post('/api/ediLog/latestFileVersion',api.getLatestVersion);

app.post('/api/edi/saveAsDraft',api.createDraft);
app.post('/api/edi/getDraft',api.getDraft);

app.post('/api/report/get',api.getReport);

app.use('/', routes.index);


// START THE SERVER
// ==============================================

app.listen(port);
console.log('Magic happens on port ' + port);

