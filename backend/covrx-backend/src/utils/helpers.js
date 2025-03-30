module.exports = {
    generateResponse: (status, message, data = null) => {
        return {
            status,
            message,
            data
        };
    },

    validateEmail: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    hashPassword: async (password) => {
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    },

    comparePassword: async (password, hashedPassword) => {
        const bcrypt = require('bcrypt');
        return await bcrypt.compare(password, hashedPassword);
    },

    generateToken: (userId, secret, expiresIn) => {
        const jwt = require('jsonwebtoken');
        return jwt.sign({ id: userId }, secret, { expiresIn });
    }
};