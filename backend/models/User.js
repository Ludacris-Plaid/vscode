const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: config.validation.username.min,
    maxlength: config.validation.username.max
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: config.validation.password.min
  },
  profilePicture: {
    type: String,
    default: '/images/default-profile.png'
  },
  bio: {
    type: String,
    default: ''
  },
  accountType: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  socialLinks: {
    youtube: String,
    instagram: String,
    tiktok: String,
    twitter: String
  },
  skills: [String],
  joinedDate: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save hook to hash password
UserSchema.pre('save', async function(next) {
  // Only hash the password if it's modified
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(config.passwordSalt);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to return sanitized user data
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', UserSchema);