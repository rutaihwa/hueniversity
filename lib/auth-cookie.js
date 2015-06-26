// Load modules

var Users = require('./users.json');

// Declare internals

var internals = {};


internals.validateFunc = function (username, password, callback) {

    var user = Users[username];
    if (!user || user.password !== password) {
        return callback(null, false);
    }

    user.username = username;

    return callback(null, true, user);
};


exports.register = function (server, options, next) {

    // Code inside the callback function of server.dependency will only be
    // executed after hapi-auth-cookie have been registered.  It's triggered by
    // server.start, and runs before actual starting of the server.  It's done because
    // the call to server.auth.strategy upon registration would fail and make the
    // server crash if the session scheme is not previously registered by hapi-auth-cookie.
    server.dependency('hapi-auth-cookie', function (server, next){

        //server.auth.strategy('basic', 'basic', { validateFunc: internals.validateFunc });
        server.auth.strategy('standard', 'cookie', {
            password: 'Th1xCh@pez!#st%Qaflfi;mqvsfafa-91af4fncookie', // cookie secret
            cookie: 'hapi-cookie', // Cookie name
            isSecure: true, // required for non-https applications
            ttl: 24 * 60 * 60 * 1000, // Set session to 1 day
            redirectTo: '/login',
            appendNext: true,
            clearInvalid: true
        });

        return next();
    });

    return next();
};


exports.register.attributes = {
    name: 'Auth'
};
