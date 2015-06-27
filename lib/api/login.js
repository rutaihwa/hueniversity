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

    // Executed after Auth plugin has been installed
    server.dependency('Auth', function(server, next) {

	return next();
    });

    return next();
};

exports.register.attributes = {
    name: 'Login'
};
