
var jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const secret = 'vozmitenarabotu';

module.exports.checkIfAuthenticated = expressJwt({
    secret: secret
});

module.exports.createJWTToken = function (userId) {
    return jwt.sign({ id: `${userId}` }, secret, {
        expiresIn: 7200,
    })
}

module.exports.getUserIdFromRequestHeaderAuth = function (auth) {
    if (!auth)
        return -1;
    auth = auth.slice(7)
    let decoded = jwt.decode(String(auth));
    if (!decoded)
        return -1;
    return +decoded['id']
}