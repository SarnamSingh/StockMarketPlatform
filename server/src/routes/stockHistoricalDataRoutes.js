const express = require('express');
const router = express.Router();
const executeQuery = require('.././utility/dbHelper');
 const utility =  require('.././utility/utility');

router.get('/OneDayVolumeOIData/:tradedOn', (req, res) => {
    const tradedOn = req.params.tradedOn;
    const reqObject = {
        tradedOn: tradedOn
    }
    executeQuery(reqObject, "EquityFNO_Select_OneDayVolumeOI", (err, output) => {
        res.json(utility.getResponse(err, output));
        res.end();
} )
})

module.exports = router;