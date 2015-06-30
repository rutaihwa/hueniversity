// Load modules

var Path = require('path');

// Declare internals

var internals = {
    rootPath: Path.resolve(__dirname, '../'),
    viewsPath: Path.resolve(__dirname, '../views')
};

exports.register = function (server, options, next) {

    // Registration logic in internals.after will execute on                                         // server start only after dependencies are fully registered.
    server.dependency(['Auth'], internals.after);

    next();
};


//  Internals that depends on plugin dependencies have been registered
internals.after = function (server, next) {

    // Views

    server.views({
        engines: {
            html: require('handlebars')
        },
        path: '../views',
        partialsPath: '../views/partials',
        relativeTo: __dirname
    });

    // Static assets

    server.route({
        method: 'GET',
        path: '/{assetpath*}',
        config: {
            auth: false,
            handler: {
                directory: {
                    path: './assets/'
                }
            }
        }
    });

    // Routes

    server.route([

        // `/login` - GET

        {
            method: 'GET',
            path: '/login',
            config: {
                description: 'Returns a login form',
                auth: {
                    mode: 'try',
                        strategy: 'university'
                },
                plugins: {
                    'hapi-auth-cookie': {
                        redirectTo: false
                    }
                },
                handler: function (request, reply){

                    // If alredy authenticated
                    if (request.auth.isAuthenticated) {
                        return reply.redirect('/account');
                    }

                    return reply.view('login');
                }
            }
        },

        // `/home` - GET

        {
            method: 'GET',
            path: '/home',
            config: {
                description: 'Returns the home page',
                handler: {
                    view: {
                        template: 'home'
                    }
                }
            }
        },

        // `/account` - GET

        {
            method: 'GET',
            path: '/account',
            config: {
                description: 'Returns an account page',
                auth: {
                    strategy: 'university',
                    scope: ['admin', 'user']
                },
                handler: function (request, reply) {

                    // If admin
                    var adminUser = false;

                    if (request.auth.credentials.scope[0] === 'admin') {
                        adminUser = true;
                    }

                    var userInfo = {
                        first: request.auth.credentials.first,
                        last: request.auth.credentials.last,
                        admin: adminUser
                    };

                    return reply.view('account', { user: userInfo });
                }
            }
        },

        // `/admin` - GET

        {
            method: 'GET',
            path: '/admin',
            config: {
                description: 'Returns an admin page',
                auth: {
                    strategy: 'university',
                    scope: ['admin']
                },
                handler: function (request, reply) {

                    // User info
                    var userInfo = {
                        first: request.auth.credentials.first,
                        last: request.auth.credentials.last
                    };

                    return reply.view('admin', { user: userInfo });
                }
            }
        }
    ]);

    return next();
};

exports.register.attributes = {
    name: 'Home'
};
