const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { authConfig } = require('../config/auth');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'You are not logged in! Please log in to get access.' });
    }

    try {
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
};

exports.isAuthenticated = (req, res, next) => {
    if (req.user) {
        return next();
    }
    return res.status(403).json({ message: 'You do not have permission to perform this action.' });
};