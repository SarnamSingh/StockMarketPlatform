const express = require('express');
const router = express.Router();
const userRoutes = require('../user/userRoutes');
const bhavCopyRoutes = require('./bhavcopyRoutes');
const bhavCstockHistoricalDataRoutes = require('./stockHistoricalDataRoutes');

router.get('/', (req, res)=>{
    res.json('Welcome to Full stack application on javascript environment.');
});
router.use('/bhavcopy', bhavCopyRoutes);
router.use('/StockHistoricalData', bhavCstockHistoricalDataRoutes)
router.use('/user', userRoutes);
                 


module.exports = router;