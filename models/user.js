const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

// Encrypt user password using crypto
userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(this.password, salt, 1000, 64, 'sha512').toString('hex');
    this.password = `${hash}:${salt}`;
  }
  next();
});

// Verify user password using crypto
userSchema.methods.verifyPassword = function (password) {
  const [hash, salt] = this.password.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
};

const User = mongoose.model('User', userSchema);

// CRUD functions for User module
const createUser = async (user) => {
  const newUser = new User(user);
  await newUser.save();
  return newUser;
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

const updateUserById = async (id, updatedUser) => {
  const user = await User.findByIdAndUpdate(id, updatedUser, { new: true });
  return user;
};

const deleteUserById = async (id) => {
  const user = await User.findByIdAndDelete(id);
  return user;
};

module.exports = { User, createUser, getUserById, updateUserById, deleteUserById };
