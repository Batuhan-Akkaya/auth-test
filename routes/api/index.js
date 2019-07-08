const express = require('express');
const router = express.Router();

router.use('/user', require('./user'));
router.use('/project', require('./project'));
router.use('/oauth2', require('./oauth2'));
router.use('/application', require('./application'));

module.exports = router;
