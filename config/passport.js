const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const OAuth2Strategy = require('passport-oauth2').Strategy;

const Users = mongoose.model('Users');

// Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, (email, password, done) => {
    Users.findOne({ email })
        .then((user) => {
            if(!user || !user.validatePassword(password)) {
                return done(null, false, { errors: { 'email or password': 'is invalid' } });
            }

            return done(null, user);
        }).catch(done);
}));

const oauth2orize = require('oauth2orize');
global.oauthServer = oauth2orize.createServer();
const {AccessToken, Application, GrantCode} = require('../models/oauth2');

oauthServer.grant(oauth2orize.grant.code(function(application, redirectURI, user, ares, done) {
    console.log({application, redirectURI, user, ares});
    const grant = new GrantCode({
        application: application,
        // user: user,
    });
    grant.save(function(error) {
        done(error ? error : null, grant.code);
    });
}));
oauthServer.exchange(oauth2orize.exchange.code({
    userProperty: 'app'
}, function(application, code, redirectURI, done) {
    console.log({code, redirectURI});
    GrantCode.findOne({ code }, function(error, grant) {
        console.log(code);
        if (grant && grant.active /*&&grant.application == application._id*/) {
            const token = new AccessToken({
                application: grant.application,
                user: grant.user,
                grant: grant
            });
            token.save(function(error) {
                done(error, error ? null : token.token, null, error ? null : { token_type: 'standard' });
            });
        } else {
            done(error, false);
        }
    });
}));
oauthServer.serializeClient(function(application, done) {
    done(null, application.id);
});
oauthServer.deserializeClient(function(id, done) {
    Application.findById(id, function(error, application) {
        done(error, error ? null : application);
    });
});
