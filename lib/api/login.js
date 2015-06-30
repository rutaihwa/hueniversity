var Hoek = require('hoek');
var Boom = require('boom');
var Joi = require('joi');
var Users = require('../users.json');

var internals = {};

// getValidatesUser
// Validates user and return shallow copy of the user details to be used
// for the cookie

internals.getValidatedUser = function (username, password) {

    var account = null;

    account = Users[username];

    if (!account || account.password !== password) {
        return {
            error: {
                message: 'Invalid username or password' }
        };
    }

    accountCache = Hoek.clone(account);
    delete accountCache.password;

    return accountCache;
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
                    validate: {
                        payload: {
                            username: Joi.string().min(3).max(6),
                            password: Joi.string().min(3).max(7)
                        }
                    },
                    handler: function (request, reply) {

                        var user = internals.getValidatedUser(request.payload.username, request.payload.password);

                        // When user is not found
                        if (user.error) {
                            console.log('user not found!');
                            return reply(Boom.unauthorized(user.error.message));
                        }

                        // Otherwise create a session
                        request.auth.session.set(user);

                        return reply(user);

                    }
                }
            }
    ]);

    return next();
};

exports.register.attributes = {
    name: 'Login'
};
