const express = require('express');
const router = express.Router();

router.use('/user', require('./user'));
router.use('/project', require('./project'));
router.use('/oauth2', require('./oauth2'));

module.exports = router;
