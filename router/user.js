const express = require('express');
const { registerUser, loginUser, resetPassword } = require('../controller/user');
const router = express.Router();


router.get('/' ,  (req , res)=>{
    res.send('user get route');
})

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', resetPassword);

module.exports = router;