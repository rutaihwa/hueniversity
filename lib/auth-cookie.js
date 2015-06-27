// Load modules

var Users = require('./users.json');

// Declare internals

var internals = {};


exports.register = function (server, options, next) {

    // Code inside the callback function of server.dependency will only be
    // executed after hapi-auth-cookie have been registered.  It's triggered by
    // server.start, and runs before actual starting of the server.  It's done because
    // the call to server.auth.strategy upon registration would fail and make the
    // server crash if the session scheme is not previously registered by hapi-auth-cookie.
    server.dependency('hapi-auth-cookie', function (server, next){

        // Defining auth strategy - university

        server.auth.strategy('university', 'cookie', {
            password: 'Th1xCh@pez!#st%Qaflfi;mqvsfafa-91af4fncookie',
            cookie: 'hapi-university',
            isSecure: true,
            ttl: 24 * 60 * 60 * 1000,
            redirectTo: '/login',
            clearInvalid: true
        });

        // Blacklisting all routes
        server.auth.default({
            strategy: 'university'
        });

        return next();
    });

    return next();
};


exports.register.attributes = {
    name: 'Auth'
};
