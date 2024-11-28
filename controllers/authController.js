

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

// Register a new user
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    console.log('Received registration data:', req.body);

    try {
        // Check if the email already exists
        console.log('Checking if email exists in the database...');
        const [results] = await db.query('SELECT email FROM users WHERE email = ?', [email]);

        if (results.length > 0) {
            // Email already exists
            return res.status(400).json({ message: 'Email already registered. Please use a different email.' });
        }

        // Hash the password
        console.log('Email is available. Proceeding to hash password...');
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully:', hashedPassword);

        // Insert the new user
        console.log('Inserting new user...');
        const [insertResult] = await db.query(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        console.log('User registered successfully:', insertResult);
        res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Error during registration', details: err.message });
    }
};

// Login an existing user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Attempting to login with email:', email);

        // Find the user by email
        const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (results.length === 0 || !bcrypt.compareSync(password, results[0].password_hash)) {
            // Email not found or password incorrect
            console.log('Invalid credentials');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { user_id: results[0].user_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Login successful, sending token:', token);
        res.json({ token });

    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Error during login', details: err.message });
    }
};

// Logout function
exports.logout = (req, res) => {
    // For session-based logout
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({ message: 'An error occurred.', error: err.message });
            }
            console.log('Session destroyed successfully.');
            return res.status(200).json({ message: 'Successfully logged out.' });
        });
    } else {
        // For JWT-based logout, token invalidation is typically handled on the client
        res.status(200).json({ message: 'Logout successful. Please clear your token on the client side.' });
    }
};
