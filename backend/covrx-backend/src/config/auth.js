const jwt = require('jsonwebtoken');

const authConfig = {
    secret: process.env.JWT_SECRET || 'your_default_secret_key',
    expiresIn: '1h', // Token expiration time
};

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
    });
};

module.exports = {
    authConfig,
    generateToken,
};