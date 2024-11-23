const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const loanRoutes = require('./routes/loanRoutes');
const path = require('path');
require('dotenv').config();
const { authenticateToken } = require('./middleware');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/protected-route', authenticateToken, (req, res) => {
    res.json({ message: "You accessed a protected route!" });
});


// This serves `register.html` for the register route
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'register.html')); 
});

// This serves `login.html` for the login route
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'login.html')); 
});

app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route.', user: req.user });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
