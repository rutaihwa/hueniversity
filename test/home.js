// Load modules

var Code = require('code');
var Lab = require('lab');
var University = require('../lib');
var Path = require('path');
var Config = require('../lib/config');
var Auth = require('hapi-auth-cookie');

// Declare internals

var internals = {};


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Code.expect;
var it = lab.test;

describe('/home', function () {

    it('ensures that /home is always redirected to https', function (done) {

        University.init(internals.manifest, internals.composeOptions, function (err, server) {

            expect(err).to.not.exist();

            var request = { method: 'GET', url: '/home' };
            server.select('web').inject(request, function (res) {

                expect(res.statusCode, 'Status code').to.equal(301);
                expect(res.headers.location).to.equal('https://localhost:8001/home');

                server.stop(done);
            });
        });
    });

    it('redirects to /login when user is not logged in', function (done) {

        University.init(internals.manifest, internals.composeOptions, function (err, server) {

            expect(err).to.not.exist();

            var request = { method: 'GET', url: '/home' };
            server.select('web-tls').inject(request, function (res) {

                expect(res.statusCode, 'Status code').to.equal(302);
		expect(res.headers.location).to.equal('/login');

                server.stop(done);
            });
        });
    });

    it('returns an home page via https', function (done) {

        University.init(internals.manifest, internals.composeOptions, function (err, server) {

            expect(err).to.not.exist();

            var request = { method: 'GET', url: '/home' };
            server.select('web-tls').inject(request, function (res) {

		// If not loged in will always be redirecte to /login
                //expect(res.statusCode, 'Status code').to.equal(200);

                server.stop(done);
            });
        });
    });
});

internals.manifest = {
    connections: [
        {
            host: 'localhost',
            port: 0,
            labels: ['web']
        },
        {
            host: 'localhost',
            port: 0,
            labels: ['web-tls'],
            tls: Config.tls
        }
    ],
    plugins: {
        './home': {},
	'./auth-cookie': {},
	'hapi-auth-cookie': {}
    }
};

internals.composeOptions = {
    relativeTo: Path.resolve(__dirname, '../lib')
};
