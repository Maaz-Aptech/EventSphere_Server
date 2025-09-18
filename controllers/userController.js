// @desc Get count of issued certificates
// @route GET /api/users/certificates-count
// @access Public
// server/controllers/userController.js
import User from '../models/User.js';
import Registration from '../models/Registration.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @desc Register new user
// @route POST /api/users/register
// @access Public
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role, department, enrollmentNo, mobile } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      department,
      enrollmentNo,
      mobile,
    });

    res.status(201).json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      department: user.department,
      enrollmentNo: user.enrollmentNo,
      mobile: user.mobile,
      token: generateToken(user),
    });
  } catch (err) {
    console.error('registerUser error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc Login user
// @route POST /api/users/login
// @access Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      department: user.department,
      enrollmentNo: user.enrollmentNo,
      mobile: user.mobile,
      token: generateToken(user),
    });
  } catch (err) {
    console.error('loginUser error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// @desc Get current user profile
// @route GET /api/users/profile
// @access Private
export const getUserProfile = async (req, res) => {
  try {
    // req.user should be set by auth middleware
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      department: user.department,
      enrollmentNo: user.enrollmentNo,
      mobile: user.mobile,
    });
  } catch (err) {
    console.error('getUserProfile error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc Get count of active students (role: participant)
// @route GET /api/users/active-students-count
// @access Public
export const getActiveStudentsCount = async (req, res) => {
  try {
    const count = await User.countDocuments({ role: 'participant' });
    res.json({ count });
  } catch (err) {
    console.error('getActiveStudentsCount error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


export const getCertificatesCount = async (req, res) => {
  try {
    const count = await Registration.countDocuments({ certificatePaid: true });
    res.json({ count });
  } catch (err) {
    console.error('getCertificatesCount error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};