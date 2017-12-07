var express = require('express');
var router = express.Router();
var controller = require('../controller/controller');

router.route('/v1/createUser')
    .post(controller.createUser);

router.route('/v1/getUser')
    .get(controller.findAll);

router.route('/v1/createSQLTable')
    .post(controller.createDb);

router.route('/v1/insertData')
    .post(controller.insertData);

module.exports = router;