// Load modules

var Code = require('code');
var Lab = require('lab');
var University = require('../lib');
var Auth = require('hapi-auth-cookie');
var Path = require('path');
var Hoek = require('hoek');

// Declare internals

var internals = {};


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Code.expect;
var it = lab.test;

describe('/auth-cookie', function () {

    it('errors on failed registering of hapi-auth-cookie', { parallel: false }, function (done) {

        var orig = Auth.register;

        Auth.register = function (plugin, options, next) {

            Auth.register = orig;
            return next(new Error('fail'));
        };

        Auth.register.attributes = {
            name: 'fake hapi-auth-cookie'
        };

        University.init(internals.manifest, internals.composeOptions, function (err) {

            expect(err).to.exist();

            done();
        });
    });

    it('errors on missing hapi-auth-cookie plugin', function (done) {

        var manifest = Hoek.clone(internals.manifest);
        delete manifest.plugins['hapi-auth-cookie'];

        var failingInit = University.init.bind(University, manifest, internals.composeOptions, function (err) {

            done();
        });

        expect(failingInit).to.throw();

        done();
    });
});


internals.manifest = {
    connections: [
        {
            port: 0
        }
    ],
    plugins: {
        './auth-cookie': {},
	'hapi-auth-cookie': {}
    }
};

internals.composeOptions = {
    relativeTo: Path.resolve(__dirname, '../lib')
};
