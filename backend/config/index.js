module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    expiresIn: '7d'
  },
  passwordSalt: 10,
  validation: {
    username: {
      min: 3,
      max: 20
    },
    password: {
      min: 8
    }
  }
};