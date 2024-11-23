

const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    // Check if Authorization header is provided
    if (!authHeader) {
        return res.status(403).json({ error: 'Authorization header missing. Access denied.' });
    }

    // Split the header to extract the Bearer token
    const token = authHeader.split(' ')[1];

    // Ensure token is provided after Bearer
    if (!token) {
        return res.status(403).json({ error: 'Token not provided. Access denied.' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Error verifying token:', err.message); // Log error for debugging
            return res.status(403).json({ error: 'Invalid or expired token. Access denied.' });
        }

        // Attach user information from token to request object
        req.user = user;
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = { authenticateToken };
