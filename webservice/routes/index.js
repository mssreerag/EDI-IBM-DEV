// GET home page.

exports.index = function(req, res){
	res.contentType('text/html');
	res.render('../app/index.html', {title: 'Compare & Book Diagnostic Tests in Indore | MRI Scan | CT Scan | Sonography | CBC ', session: true});
//	res.send('Index of app - Change this');
};

exports.give = function(req,res){
	console.log("khwkc");
	var str = '<?xml version="1.0"?><!DOCTYPE cross-domain-policy SYSTEM "http://www.adobe.com/xml/dtds/cross-domain-policy.dtd"><cross-domain-policy><site-control permitted-cross-domain-policies="master-only"/><allow-access-from domain="*" secure="false"/><allow-http-request-headers-from domain="*" headers="*" secure="false"/></cross-domain-policy>';
	res.contentType('application/xml');
	res.send(str);
}


exports.check = function(req,res){
	if (req.session.user == 'hola') {
		// res.redirect('/adminmedd');
		res.render('../app/admin.html', {title: 'hv'});
	} else{
		if (!req.session.user) {
			console.log('No session set');
		} else {
			if (req.session.user != 'hola') {
				console.log('Wrong username password combination!!');
			};
		}
		res.redirect('/adminlogin');
	}
}

exports.adminLogin = function(req,res){
	res.contentType('text/html')
	if (req.session.user == 'hola') {
		// res.redirect('/adminmedd');
		res.render('../app/admin.html', {title: 'Login'});
	} else{
		if (!req.session.user) {
			console.log('No session set');
		} else {
			if (req.session.user != 'hola') {
				console.log('Wrong username password combination!!');
			};
		}
		res.render('../app/admin.html', {title: 'WTF'});
		// res.redirect('/adminlogin');
	}
}
// https://maps.googleapis.com/maps/api/distancematrix/json