const router = require('express').Router();
const { getUser, putMyList, getUserInfo } = require('../constrollers/user');

router.get('/', getUser);
router.get('/id/:id', getUserInfo);
router.put('/addMusic/', putMyList);

module.exports = router;
