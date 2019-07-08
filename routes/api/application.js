const {Application, AccessToken} = require('../../models/oauth2');
const router = require('express').Router();
const passport = require('passport');
const User = require('../../models/user');

router.get('/getList', (req, res, next) => {
    Application.find({}, (err, data) => {
        if (err) return next(err);
        res.json(data);
    })
});

router.post('/create', (req, res, next) => {
    const {title, scope} = req.body;
    const application = new Application({title, scope});
    application.save((err, data) => {
        if (err) return next(err);
        res.json(data);
    });
});

router.get('/getOfUser/:user', (req, res, next) => {
    AccessToken.find({user: req.params.user}, (err, data) => {
        if (err) return next(err);
        res.json(data);
    }).populate('application', 'title , scope');
});

router.post('/getUserProfile/:userId', passport.authenticate('bearer', {session: false}), (req, res, next) => {
    const {wanted_scope} = req.body;
    const {scope} = req.authInfo;
    let unauthorize = false;
    wanted_scope.forEach(wanted => {
        if (!scope.includes(wanted))
            unauthorize = true;
    });
    if (!unauthorize) {
        const areas = [];
        scope.forEach(area => {
            let x = '';
            switch (area) {
                case 'user_email':
                    x = 'email';
                    break;
                case 'user_first_name':
                    x= 'firstName';
                    break;
                case 'user_birthday':
                    x = 'birthDay';
                    break;
            }
            areas.push(x);
        });
        User.findOne({_id: req.params.userId}).select(areas.join(' , ')).exec((err, data) => {
            if (err) return next(err);
            console.log(data);
            res.json(data);
        });
    } else
        return res.send('unauthorize')
});

module.exports = router;
