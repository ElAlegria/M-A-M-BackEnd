const router = require('express').Router();
const { createMyMusic } = require('../constrollers/Card');

router.post('/addMusic', createMyMusic);

module.exports = router;
