const express = require('express');
const router = express.Router();
//const equityBhavcopyModel = require('../models/equityBhavcopy');
const executeQuery = require('../utility/dbHelper');
//const responseDetail = require('../models/responseModel');
const utility = require('../utility/utility');

router.post('/equity', (req, res) => {
    const equityBhavcopy = Object.assign({}, req.body);
    executeQuery(equityBhavcopy, "EquityBhavcopy_Insert", (err, output) => {
        res.json(utility.getResponse(err, output));
        res.end();
    });


});

module.exports = router;