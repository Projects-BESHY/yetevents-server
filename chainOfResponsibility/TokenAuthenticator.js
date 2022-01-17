const jwt = require('jsonwebtoken');

class TokenAuthenticator {

    constructor (secret) {
        this.secret = secret;
    }

    authenticate(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
    
        if (token == null) return res.status(401).json({ message: 'No token. Please provide one in the request header Authorization.' });
    
        jwt.verify(token, this.secret, (err, user) => {
            if (err) return res.status(403).json({ message: 'Invalid token' });
            req.user = user;
            next();
        })
    }
}

module.exports = TokenAuthenticator;