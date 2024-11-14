const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

exports.register = (req, res) => {
    const { name, email, password } = req.body;

    // Check if the email already exists
    db.query('SELECT email FROM Users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        
        if (results.length > 0) {
            // Email already exists
            return res.status(400).json({ message: 'Email already registered. Please use a different email.' });
        }

        // If email does not exist, hash the password and insert the new user
        const hashedPassword = bcrypt.hashSync(password, 10);

        db.query(
            'INSERT INTO Users (name, email, password_hash) VALUES (?, ?, ?)',
            [name, email, hashedPassword],
            (err, result) => {
                if (err) return res.status(500).json({ error: 'Error registering user' });
                
                res.status(201).json({ message: 'User registered successfully' });
            }
        );
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    db.query('SELECT * FROM Users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        if (results.length === 0 || !bcrypt.compareSync(password, results[0].password_hash)) {
            // Email not found or password incorrect
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { user_id: results[0].user_id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    });
};
