var express = require('express');
var router = express.Router();
var path = require('path');
const auth= require('../middleware/auth');
const db = require('../db');

router.get('/*', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../index.html'));

});

router.post('/api/login',async function (req, res, next) {
  try {
    const login = req.body.login;
    const password = req.body.password;
    const expiresIn = 7200;
    const info = (await db.query(`select * from Users where login='${login}'`))[0];
    console.log(info);
    if(password===info.password) {    
    const jwtBearerToken = auth.createJWTToken(info.id);
        res.json({
          idToken: jwtBearerToken,
          expiresIn,
          success: true
        });
      }
      else {
        res.send({ message: 'Invalid login and/or password', success: false })
      }
  }
  catch (e) {
    res.send({ message: e.message, success: false })
  }

});




module.exports = router;
