// config/database.js

module.exports = {

    authenticationType : '1',                                   
                    // 1 - using ldap bind
                    // 2 - using attributes

    options : {
    			url : 'ldap://localhost',						 //host url of the ldap server
    			// socketPath	: '', 								 //Socket path if using AF_UNIX sockets
    			// log	: '', 									     //Bunyan logger instance (Default: built-in instance)
    			// timeout	: '', 									 //Milliseconds client should let operations live for before timing out (Default: Infinity)
    			// connectTimeout : '', 							 //Milliseconds client should wait before timing out on TCP connections (Default: OS default)
    			// tlsOptions	: '',								 //Additional options passed to TLS connection layer when connecting via ldaps:// (See: The TLS docs for node.js)
    			// idleTimeout	: '',								 //Milliseconds after last activity before client emits idle event
    			// strictDN	: '' 								 //Force strict DN parsing for client methods (Default is true)
    		},

  	userQuery : {

  				//WARNING : DO NOT CHANGE the values in '{{<value>}}'  						  		
		  		user : 	'ou={{username}},ou=ibm,dc=test,dc=com'  //User bind to ldap - template for authentication

		  	},

    //Login using mail attribute
    baseDN : 'ou=bluepages,dc=test,dc=com',
    usernameAttribute : 'mail',

    adminGroup : 'cn=adminGroup,ou=bluepages,dc=test,dc=com',
    adminMemberAttribute : 'member',
};