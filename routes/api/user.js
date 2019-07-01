const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');

router.post('/register', auth.optional, (req, res, next) => {
    const { body: { email, password, role, company, firstName, lastName } } = req;

    if(!email)
        return next({status: 422, errors: {email: 'is required'}});
    if(!password)
        return next({status: 422, errors: {password: 'is required'}});

    const user = {email, password, role, company, firstName, lastName, termsOfConditions: ['01/06/2019'], projects: []};
    const finalUser = new Users(user);
    finalUser.setPassword(user.password);

    return finalUser.save()
        .then(() => res.json({ user: finalUser.toAuthJSON() }));
});

router.post('/login', auth.optional, (req, res, next) => {
    const { body: { email, password } } = req;

    if(!email)
        return next({status: 422, errors: {email: 'is required'}});
    if(!password)
        return next({status: 422, errors: {password: 'is required'}});

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
        if(err) return next(err);
        if(passportUser) {
            const user = passportUser;
            user.token = passportUser.generateJWT();

            return res.json({ user: user.toAuthJSON() });
        }

        return next({status: 404, message: 'User not found'});
    })(req, res, next);
});

router.get('/get', auth.required, (req, res, next) => {
    const { payload: { id } } = req;

    return Users.findById(id)
        .then((user) => {
            if(!user) return res.sendStatus(400);

            return res.json({ user: user.toAuthJSON() });
        });
});

module.exports = router;
