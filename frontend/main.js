document.addEventListener("DOMContentLoaded", () => {
    const API_URL = 'http://localhost:3000/api';

    // Helper function to display messages
    const displayMessage = (elementId, message, type = "info") => {
        const messageDiv = document.getElementById(elementId);
        messageDiv.textContent = ''
        messageDiv.textContent = message
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = "block";
        setTimeout(() => {
            messageDiv.textContent = ''
            messageDiv.style.display = "none";
 
        }, 5000)
    };

    // Registration Form Submission
    document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!name || !email || password.length < 6) {
            displayMessage('registerMessage', "Please fill out all fields and ensure the password is at least 6 characters.", "error");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            if (response.ok) {
                displayMessage('registerMessage', "Registration successful! Redirecting to login page.", "success");
                setTimeout(() => window.location.href = 'login.html', 1000);
            } else {
                const error = await response.json();
                displayMessage('registerMessage', `Registration failed: ${error.message}`, "error");
            }
        } catch (error) {
            console.error("Error during registration:", error);
            displayMessage('registerMessage', "Registration failed. Please try again later.", "error");
        }
    });

    // Login Form Submission
    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                displayMessage('loginMessage', "Login successful! Redirecting to dashboard.", "success");
                setTimeout(() => window.location.href = 'dashboard.html', 1000);
            } else {
                displayMessage('loginMessage', "Login failed: Invalid email or password.", "error");
            }
        } catch (error) {
            console.error("Error during login:", error);
            displayMessage('loginMessage', "Login failed. Please try again later.", "error");
        }
    });

    const token = localStorage.getItem('token');
    if (token) {
        const userId = getUserIdFromToken(token); // Extract user_id from token
        if (userId) {
            fetchLoanDetails(userId); // Fetch loan details for the logged-in user
        }
    } else {
        console.log("User not logged in. Skipping loan details fetch.");
    }

  // Loan Application Form Submission
  document.getElementById('loanForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('userId').value.trim();
    const loanAmount = parseFloat(document.getElementById('loanAmount').value);
    const loanTermMonths = parseInt(document.getElementById('loanTermMonths').value);
    const repaymentSchedule = document.getElementById('repaymentSchedule').value;

    if (!userId || isNaN(loanAmount) || isNaN(loanTermMonths) || !repaymentSchedule) {
        displayMessage('loanMessage', "Please fill out all loan fields correctly.", "error");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/loans/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId, loanAmount, loanTermMonths, repaymentSchedule })
        });
        
        const result = await response.json()
        
        if (result.success) {
            
            displayMessage('loanMessage', "Loan application submitted successfully!", "success");
            fetchLoanDetails(userId); // Refresh loan details
        } else {
            const error = await response.json();
            displayMessage('loanMessage', `Loan application failed: ${error.message}`, "error");
        }
    } catch (error) {
        console.error("Error applying for loan:", error);
        displayMessage('loanMessage', "Loan application failed. Please try again later.", "error");
    }
});

    // Fetch Loan Details and Populate Table
    async function fetchLoanDetails(userId) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/loans/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const loans = await response.json();
            if (response.ok) {
                const container = document.getElementById("loanDetailsContainer");

                if (container) {
                    if (loans.length > 0) {
                        container.innerHTML = `
                            <div class="loan-table-container">
                                <table class="loan-table">
                                    <thead>
                                        <tr>
                                            <th>Loan ID</th>
                                            <th>Amount</th>
                                            <th>Term (Months)</th>
                                            <th>Repayment Schedule</th>
                                            <th>Status</th>
                                            <th>Start Date</th>
                                            <th>Due Date</th>
                                            <th>Total Repayment</th>
                                            <th>Balance Due</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${loans.map(loan => `
                                            <tr>
                                                <td>${loan.loan_id}</td>
                                                <td>$${loan.loan_amount}</td>
                                                <td>${loan.loan_term_months}</td>
                                                <td>${loan.repayment_schedule}</td>
                                                <td>${loan.loan_status}</td>
                                                <td>${loan.loan_start_date}</td>
                                                <td>${loan.loan_due_date}</td>
                                                <td>$${loan.total_repayment_amount}</td>
                                                <td>$${loan.balance_due}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        `;
                    } else {
                        container.innerHTML = `<p>No loans found for this user.</p>`;
                    }
                }
            } else {
                displayMessage('loanDetailsMessage', "Failed to fetch loan details. Please try again later.", "error");
            }
        } catch (error) {
            console.error("Error fetching loan details:", error);
            displayMessage('loanDetailsMessage', "Unable to fetch loan details. Please try again later.", "error");
        }
    }

    // Logout Functionality
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                displayMessage('logoutMessage', "You are not logged in.", "error");
                return;
            }

            try {
                const response = await fetch(`${API_URL}/auth/logout`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    localStorage.removeItem('token');
                    displayMessage('logoutMessage', "Logout successful! Redirecting to login page.", "success");
                    setTimeout(() => window.location.href = 'login.html', 1000);
                } else {
                    displayMessage('logoutMessage', "Logout failed. Please try again later.", "error");
                }
            } catch (error) {
                console.error("Error during logout:", error);
                displayMessage('logoutMessage', "Logout failed. Please try again later.", "error");
            }
        });
    }

    // Helper function to decode JWT and extract user_id
    function getUserIdFromToken(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.user_id || null; // Return the user_id from the payload
        } catch (error) {
            console.error("Error decoding token:", error);
            return null; // Return null if token is invalid or decoding fails
        }
    }
});






