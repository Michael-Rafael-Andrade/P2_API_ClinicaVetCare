var express = require('express');
var router = express.Router();
const controllerIndex = require('../controller/controllerIndex.js');

router.get('/', (req, res, next) => {
    /* #swagger.tags = ['Index']
       #swagger.summary = 'Página ou endpoint inicial da VetCare API'
    */
    controllerIndex.index(req, res, next);
});

module.exports = router;