const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');
const User = require('../../models/user');
const Project = mongoose.model('Project');
const passport = require('passport');

router.post('/create', auth.required, (req, res, next) => {
    const {name, type} = req.body;
    const userId = req.payload.id;

    const project = new Project({name, type});
    project.save((err, data) => {
        if (err) return next(err);
        User.findOneAndUpdate({_id: userId}, {$push:{projects: data._id}}, function (err, doc) {
            if (err) return next(err);
            return res.json({created: 1, data});
        });
    });
});

router.get('/private-test', passport.authenticate('bearer', { session: false }), (req, res) => {
    res.send(req.user);
});


module.exports = router;
