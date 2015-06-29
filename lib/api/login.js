var Hoek = require('hoek');
var Boom = require('boom');
var Joi = require('joi');
var Users = require('../users.json');

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

    // Registration logic in internals.after will execute on                                         // server start only after dependencies are fully registered.
    server.dependency(['Auth'], internals.after);

    next();
};

// After registration has been done
internals.after = function (server, next) {

    server.route([

            {
                method: 'POST',
                path: '/login',
                config: {
                    description: 'Handles login attempt',
                    auth: {
                        mode: 'try',
                        strategy: 'university'
                    },
                    plugins: {
                        'hapi-auth-cookie': {
                            redirectTo: false
                        }
                    },
                    handler: function (request, reply) {

                        console.log(request.payload);
                        return reply('This is post ' + request.payload);
                    }
                }
            }
    ]);

    return next();
};

exports.register.attributes = {
    name: 'Login'
};
