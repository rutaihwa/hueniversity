var Config = require('./config');

var composer = module.exports = {};

composer.manifest = {
    connections: [
        {
            host: 'localhost',
            port: 8000,
            labels: ['web']
        },
        {
            host: 'localhost',
            port: 8001,
            labels: ['web-tls', 'api'],
            tls: Config.tls
        }
    ],
    plugins: {
        './version': [{
            'select': ['web-tls']
        }],
        './home': [{
            'select': ['web-tls']
        }],
        './api/login': [{
            'select': ['api']
        }],
        './auth-cookie': {},
        'hapi-auth-cookie': {}
    }
};

composer.composeOptions = {
    relativeTo: __dirname
};
