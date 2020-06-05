const express = require('express');
const router = express.Router();
const userRoutes = require('../user/userRoutes');

router.get('/', (req, res)=>{
    res.json('Welcome to Full stack application on javascript environment.');
});

router.use('/user', userRoutes);
                 


module.exports = router;