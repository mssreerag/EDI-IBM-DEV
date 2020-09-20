
var mandrill        = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('b20nT3Wd5D_qoYEFJS8mrg');

var confirmation = require('./emails/confirmation-mail.js')

exports.send = function(type, data){
  switch (type){
    case 'confirmation':
      var message = confirmation.create(data.to, data.name)
    break

  }
}