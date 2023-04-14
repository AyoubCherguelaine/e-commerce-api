const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminControllers = {};

// Admin Register
adminControllers.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if admin with same username already exists
    const adminExists = await Admin.findOne({ username });
    if (adminExists) {
      return res.status(409).json({ message: 'Admin already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new admin document
    const newAdmin = new Admin({ username, password: hashedPassword });

    // Save the admin document
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin Login
adminControllers.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the admin document with the given username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check if the given password matches with the hashed password in the admin document
    const isValidPassword = await admin.isValidPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate and send the JWT token in the response
    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET);
    res.json({ message: 'Admin logged in successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = adminControllers;
