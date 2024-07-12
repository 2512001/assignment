const bcrypt = require('bcrypt');
const User = require('../model/user');
var jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (!(username && email && password)) {
            return res.status(400).json({ message: 'Please enter valid input' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        const response = await user.save();
        
        res.status(201).json({
            message: 'User created successfully',
            user: response,
            success: true
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!(username && password)) {
            return res.status(400).json({ message: 'Please enter username and password' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = generateToken(user);
        
        res.status(200).cookie('token', token, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }).json({
            message: 'Login successful',
            token: token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
};

const generateToken = (user) => {
    return jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '2h' });
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        
        if (!(email && newPassword)) {
            return res.status(400).json({ message: 'Please enter email and new password' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password' });
    }
};
