const express = require('express');
const router = express.Router();
const TwoDayRelationshipFilter = require('../models/twoDayRelationshipFilter');

const executeQuery = require('../utility/dbHelper');
let utility = require('../utility/utility');

router.get('/equity/getTwoDayRelationship/:fromDate/:toDate/:price/:fromFloorPointWidth/:toFloorPointWidth', (req, res)=>{
    const twoDayRelationshipFilter = new TwoDayRelationshipFilter();
    twoDayRelationshipFilter.fromDate = req.params.fromDate;
    twoDayRelationshipFilter.toDate = req.params.toDate;
    twoDayRelationshipFilter.price = req.params.price;
    twoDayRelationshipFilter.fromFloorPointWidth = req.params.fromFloorPointWidth;
    twoDayRelationshipFilter.toFloorPointWidth = req.params.toFloorPointWidth;
    
    executeQuery(twoDayRelationshipFilter, "EquityBhavcopy_CalculateTwoDayRelationship_FloorPivotWithWidth_Camrilla", (err, output)=>{
        res.json(utility.getResponse(err, output));
        res.end();
    });
});

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