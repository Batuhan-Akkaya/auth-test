const passport = require('passport');
const router = require('express').Router();

router.get('/auth', passport.authenticate('oauth2'));

router.get('/callback', passport.authenticate('oauth2', {failureRedirect: '/oauth2/error'}), function (req, res) {
    res.send(req.params);
});
router.get('/authorize', function (req, res) {
    res.send(req.query);
});

module.exports = router;
