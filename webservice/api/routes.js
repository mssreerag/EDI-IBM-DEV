// app/routes.js

// load the user model
var User = require('./models/users');

// expose the routes to our app with module.exports
module.exports = function(app) {

    // api ---------------------------------------------------------------------
    // get all users
    app.get('/api/users', function(req, res) {

        ...

    });

    // create user and send back all users after creation
    app.post('/api/users', function(req, res) {

        ...

    });

    // delete a user
    app.delete('/api/users/:user_id', function(req, res) {

        ...

    });

    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

};