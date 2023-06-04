const jwt = require('jsonwebtoken');
const config = require('config');

function authMiddleware(req, res, next) {
    if(req.method === 'OPTIONS') return next();

    try {
        const token = req.headers.authorization.split(' ')[1];

        if(!token) {
            return res.status(400).json({message: "No authorization"});
        }

        const decoded = jwt.verify(token, process.env.secret);
        req.user = decoded;
        next();
    } catch (e) {
        console.log(e);
        return res.status(400).json({message: "something wrong"})
    }
}

module.exports = authMiddleware;