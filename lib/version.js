// Load modules

var Pkg = require('../package.json');


// Declare internals

var internals = {
    response: {
        version: Pkg.version
    }
};

exports.register = function (server, options, next) {

    // Registration logic in internals.after will execute on                                         // server start only after dependencies are fully registered.
    server.dependency(['Auth'], internals.after);

    next();
};

internals.after = function (server, next) {

    server.route({
        method: 'GET',
        path: '/version',
        config: {
            description: 'Returns the version of the server',
            auth: false,
            handler: function (request, reply) {

                return reply(internals.response);
            }
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'version'
};
