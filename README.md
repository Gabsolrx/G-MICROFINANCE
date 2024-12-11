G-Microfinance Database: The Loan Wizard 🧙‍♂️✨
Welcome to The Loan Wizard, where finance meets magic! This project is a mystical microfinance database system designed to track loans, repayments, and transaction histories for our heroic users. Built with modern web technologies, this platform offers a seamless way to manage enchanted financial data.

TECHNOLOGIES USED🛠️

BACKEND
Node.js: The magical backend runtime.
Express.js: For crafting enchanted routes.
MySQL: The spellbook storing all financial adventures.

FRONTEND
HTML5: The structure of the Loan Wizard's portal.
CSS3: The enchantment that brings style and grace.
JavaScript: The magic that makes the portal dynamic.

FEATURES
User Registration and Authentication: Secure login for borrowers.
Loan Management: Track loan amounts, interest rates, and repayment schedules.
Transaction History: Maintain a detailed log of all financial activities.
Responsive Design: Access the portal from any device.

Installation Instructions 🪄
Prerequisites
Node.js installed on your system.
MySQL installed and running.
A code editor like VS Code.
Steps to Set Up the Project

Clone the Repository:
bash
git clone https://github.com/Gabsolrx/G-MICROFINANCE.git
cd G-MICROFINANCE


Install Dependencies:
bash
npm init -y
npm install express, mysql2, bcryptjs, dotenv, jsonwebtoken, cors, nodemon



Set Up the Database:
Create a new MySQL database called loanwizard 




CREATE NECESSARY TABLES ON MYSQL WORKBENCH
USER'S TABLE
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    loan_amount DECIMAL(10, 2) NOT NULL,
    loan_term_months INT NOT NULL,
    repayment_schedule VARCHAR(255) NOT NULL,
    loan_status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
    loan_start_date DATE NOT NULL,
    loan_due_date DATE NOT NULL,
    total_repayment_amount DECIMAL(10, 2) NOT NULL,
    balance_due DECIMAL(10, 2) NOT NULL,
    amount_paid DECIMAL(10, 2) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);



THE PROJECT WAS STRUCTURED AS SEEN BELOW:
Project Structure 📁

G-MICROFINANCE/
├── backend/
│   ├── config/
│   │   └── db.js                   # Database connection setup
│   ├── controllers/
│   │   ├── authController.js       # Handles user authentication logic
│   │   └── loanController.js       # Handles loan-related logic
│   ├── routes/
│   │   ├── authRoute.js            # Routes for user authentication
│   │   └── loanRoute.js            # Routes for loan management
│   ├── middleware.js               # Middleware for request handling (e.g., authentication)
│   └── server.js                   # Main server entry point
├── frontend/
│   ├── dashboard.html              # User dashboard
│   ├── homepage.html               # Landing page
│   ├── login.html                  # Login page
│   ├── register.html               # User registration page
│   ├── main.js                     # Frontend logic
│   └── style.css                   # Stylesheet for frontend
├── .env                            # Environment variables (e.g., DB credentials, JWT secrets)
├── package.json                    # Project dependencies and scripts
├── README.md                       # Documentation for the project
└── database/
    └── schema.sql                  # Database schema for setting up tables


Challenges Faced 🤔
Database Relationships: Defining clear connections between users, loans, and transactions required careful planning.
Security: Ensuring user authentication and protecting sensitive data was a top priority.
Responsive Design: Adjusting the layout to work seamlessly on both desktop and mobile devices posed a unique challenge.
Data Validation: Validating user inputs to prevent magical chaos in the database.


Future Enhancements 🔮
Implement a dashboard for admins to monitor all user activities.
Integrate real-time notifications for upcoming repayments.
Add support for multiple currencies and interest rate calculations.
Thank you for joining us on this enchanting journey! 🌟 May your Loan Wizard project shine brightly
