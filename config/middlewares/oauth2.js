var oauth2orize = require('oauth2orize'),
    passport = require('passport'),
    login = require('connect-ensure-login'),
    mongoose = require('mongoose'),
    utils = require('../../app/lib/utils'),
    RequestToken = mongoose.model('RequestToken'),
    AccessToken = mongoose.model('AccessToken'),
    OAuthClient = mongoose.model('OAuthClient');

// create OAuth 2.0 server
var server = oauth2orize.createServer();

server.serializeClient(function (client, done) {
    return done(null, client._id);
});

server.deserializeClient(function (id, done) {
    OAuthClient.find(id, function (error, client) {
        if (error) return done(error);
        return done(null, client);
    });
});

server.grant(oauth2orize.grant.code(function (client, redirectUri, user, ares, done) {
    console.log('server.grant: client: %s, user: %s, redirectUri: %s', client, user, redirectUri);
    var code = utils.uid(16),
        doc = {
            code: code,
            user_id: user._id,
            client_id: client._id,
            redirectUri: redirectUri,
            created_at: new Date()
        };
    RequestToken.insert(doc, function (error, result) {
        console.log('server.grant: error: %s, result: %s', error, result);
        if (error) return done(error);
        done(null, code);
    });
}));

server.exchange(oauth2orize.exchange.code(function (client, request_token, redirectUri, done) {
    console.log('server.exchange: client: %s, request_token: %s', client, request_token);
    RequestToken.findOne({ client_id: client._id, code: request_token, redirectUri: redirectUri }, null, null, function (error, token) {
        console.log('server.exchange: id: %s, request_token: %s, error: %s, token: %s', client._id, request_token, error, token);
        if (error) return done(error);
        if (!token) return done(null, false);
        var uid = utils.uid(256),
            doc = {
                token: uid,
                user_id: token.user_id,
                client_id: token.client_id,
                created_at: new Date()
            };
        AccessToken.insert(doc, function (error, result) {
            console.log('server.exchange: access_token: %s, error: %s', result, error);
            if (error) return done(error);
            done(null, uid);
        });
    });
}));

exports.authorization = [
    login.ensureLoggedIn(),
    server.authorization(function (clientKey, redirectUri, done) {
        OAuthClient.findOne({ clientKey: clientKey }, null, null, function (error, client) {
            if (error) return done(error);
            return done(null, client, redirectUri);
        });
    }),
    function (req, res) {
        res.render('oauth/dialog', { title: 'Request for Access to Account', transactionId: req.oauth2.transactionID, user: req.user, oauth_client: req.oauth2.client, nomenu: true });
    }
];

exports.decision = [
    login.ensureLoggedIn(),
    server.decision()
];

exports.token = [
    passport.authenticate([ 'basic', 'oauth2-client-password' ], { session: false }),
    server.token(),
    server.errorHandler()
];
