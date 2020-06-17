const express = require('express');
const router = express.Router();

const executeQuery = require('../utility/dbHelper');
const utility = require('../utility/utility');

router.post('/equity', (req, res) => {
    const equityBhavcopy = Object.assign({}, req.body);

    executeQuery(equityBhavcopy, "EquityBhavcopy_Insert", (err, output) => {
        res.json(utility.getResponse(err, output));
        res.end();
    });
});

router.post('/fno', (req, res) => {
    const fnoBhavcopy = Object.assign({}, req.body);
    executeQuery(fnoBhavcopy, "FNOBhavcopy_Insert", (err, output) => {
        res.json(utility.getResponse(err, output));
        res.send();
    })
});

module.exports = router;