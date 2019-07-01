const router = require('express').Router();
const {Application} = require('../../models/oauth2');
const request = require('request');

router.get('/authorize', [
    // auth.required,
    oauthServer.authorize(function(applicationID, redirectURI, done) {
        Application.findOne({ oauth_id: applicationID }, function(error, application) {
            if (application) {
                done(null, application, redirectURI);
            } else if (!error) {
                done(new Error("There is no app with the client_id you supplied."), false);
            } else {
                done(error);
            }
        });
    })
], (req, res) => {
    res.render('oauth', {
        transaction_id: req.oauth2.transactionID,
        currentURL: req.originalUrl,
        response_type: req.query.response_type,
        scope: req.oauth2.client.scope,
        application: req.oauth2.client,
        redirect_uri: req.oauth2.redirectURI,
    });
    // res.send(req.oauth2)
});

router.post('/authorize/decision', oauthServer.decision());

router.get('/getToken', (req, res, next) => {
    const {code} = req.query;
    request.post({url: 'http://localhost:8000/api/oauth2/exchange', form: {grant_type: 'authorization_code', code}}, function (err, response, body) {
        if (err) return next(err);
        res.send(JSON.parse(body));
    })
});

router.post('/exchange', oauthServer.token(), oauthServer.errorHandler());

module.exports = router;
