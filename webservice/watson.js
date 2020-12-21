const DiscoveryV1 = require('ibm-watson/discovery/v1');
 var IamAuthenticator = require('ibm-watson/auth');
const discoveryClient = new DiscoveryV1({
    authenticator: new IamAuthenticator.IamAuthenticator({ apikey: 'vPWFAqIxI1Zkw84eCusnUmP1j6Rj9p0H8VtN85JdgfTf' }),
    version: '2020-04-01',  });
console.log(discoveryClient);
