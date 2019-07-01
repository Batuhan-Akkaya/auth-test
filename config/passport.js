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

// OAuth2 Strategy
// const server = 'http://localhost:8000';
// const oauth2_config = {
//     tokenURL: server + '/api/oauth2/token',
//     authorizationURL: server + '/api/oauth2/authorize',
//     clientID: '123',
//     clientSecret: '123',
//     callbackURL: server + '/api/oauth2/callback',
//     scope: ['all', 'test']
// };
// passport.use(
//     'oauth2',
//     new OAuth2Strategy(
//         oauth2_config,
//         function (req, accessToken, refreshToken, params, profile, done) {
//             // do something with the profile
//             console.log({accessToken, refreshToken, params, profile});
//             done(null, profile);
//         }
//     )
// );
