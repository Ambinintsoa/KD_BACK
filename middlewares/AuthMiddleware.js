const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Permission non accordé' });
    }
    try {
        const token_without_bearer = token.split(' ')[1];
        const decoded = jwt.verify(token_without_bearer, process.env.SECRET_KEY_ACCESS);
        req.userId = decoded.userId;
        console.log(req.userId);

        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' + error });
    }
};

module.exports = verifyToken;