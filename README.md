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
Create a new MySQL database called loanwizard_db and create necessary tables on mysql workbench
USER'S TABLE
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



LOAN'S TABLE
CREATE TABLE loans (
    loan_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    loan_amount DECIMAL(10, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL, 
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'paid', 'defaulted') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);



REPAYMENT SCHEDULE TABLE
CREATE TABLE repayment_schedules (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    loan_id INT NOT NULL,
    repayment_date DATE NOT NULL,
    repayment_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed', 'missed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (loan_id) REFERENCES loans(loan_id) ON DELETE CASCADE
);




TRANSACTION HISTORY TABLE
CREATE TABLE transaction_histories (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    loan_id INT NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_type ENUM('loan', 'repayment') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (loan_id) REFERENCES loans(loan_id) ON DELETE CASCADE
);



INTEREST RATE TABLE
CREATE TABLE interest_rates (
    rate_id INT AUTO_INCREMENT PRIMARY KEY,
    loan_id INT NOT NULL,
    rate DECIMAL(5, 2) NOT NULL, -- Percentage value (e.g., 5.00 for 5%)
    effective_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (loan_id) REFERENCES loans(loan_id) ON DELETE CASCADE
);



populate the table created with sample data:

 sample data into 'users'
INSERT INTO users (username, email, password_hash) 
VALUES 
('hero_borrower', 'hero@example.com', '$2a$10$exampleHash1'), -- Replace with a real bcrypt hash
('magic_user', 'magic@example.com', '$2a$10$exampleHash2'); -- Replace with a real bcrypt hash

 sample data into 'loans'
INSERT INTO loans (user_id, loan_amount, interest_rate, start_date, end_date, status) 
VALUES 
(1, 500.00, 5.00, '2024-01-01', '2024-06-01', 'active'),
(2, 1000.00, 4.50, '2024-02-15', '2024-08-15', 'active');

 sample data into 'repayment_schedules'
INSERT INTO repayment_schedules (loan_id, repayment_date, repayment_amount, status) 
VALUES 
(1, '2024-02-01', 100.00, 'completed'),
(1, '2024-03-01', 100.00, 'pending'),
(2, '2024-03-15', 200.00, 'pending'),
(2, '2024-04-15', 200.00, 'pending');

 sample data into 'transaction_histories'
INSERT INTO transaction_histories (user_id, loan_id, transaction_date, transaction_type, amount, description) 
VALUES 
(1, 1, '2024-01-01 10:00:00', 'loan', 500.00, 'Initial loan disbursement'),
(1, 1, '2024-02-01 12:00:00', 'repayment', 100.00, 'First repayment made'),
(2, 2, '2024-02-15 09:30:00', 'loan', 1000.00, 'Initial loan disbursement'),
(2, 2, '2024-03-15 11:00:00', 'repayment', 200.00, 'Partial repayment made');

 sample data into 'interest_rates'
INSERT INTO interest_rates (loan_id, rate, effective_date) 
VALUES 
(1, 5.00, '2024-01-01'),
(2, 4.50, '2024-02-15');

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
