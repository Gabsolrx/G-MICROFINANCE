document.addEventListener("DOMContentLoaded", () => {
    const API_URL = 'http://localhost:3000/api';

    // Helper function to display messages
    const displayMessage = (elementId, message, type = "info") => {
        const messageDiv = document.getElementById(elementId);
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.className = `message ${type}`;
            messageDiv.style.display = "block";
        }
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

    // Loan Application Form Submission
    document.getElementById("loanForm")?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const userId = document.getElementById("userId").value;
        const loanAmount = document.getElementById("loanAmount").value;
        const loanTermMonths = document.getElementById("loanTermMonths").value;
        const repaymentSchedule = document.getElementById("repaymentSchedule").value;

        try {
            const response = await fetch(`${API_URL}/apply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, loanAmount, loanTermMonths, repaymentSchedule }),
            });

            const result = await response.json();
            if (response.ok) {
                alert(`Loan applied successfully. Loan ID: ${result.loanId}`);
                fetchLoanDetails(userId);
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error("Error applying for loan:", error);
            alert("Error applying for loan. Please try again later.");
        }
    });

    // Fetch Loan Details
    async function fetchLoanDetails(userId) {
        try {
            const response = await fetch(`${API_URL}/loans/${userId}`);
            const loans = await response.json();

            const container = document.getElementById("loanDetailsContainer");
            if (container) {
                container.innerHTML = loans.map((loan) => `
                    <div class="loan-card">
                        <p><strong>Loan ID:</strong> ${loan.loan_id}</p>
                        <p><strong>Loan Amount:</strong> $${loan.loan_amount}</p>
                        <p><strong>Total Repayment:</strong> $${loan.total_repayment_amount}</p>
                        <p><strong>Balance Due:</strong> $${loan.balance_due}</p>
                        <p><strong>Status:</strong> ${loan.status}</p>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error("Error fetching loan details:", error);
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
                    const result = await response.json();
                    displayMessage('logoutMessage', result.message, "success");
                    localStorage.removeItem('token');
                    setTimeout(() => window.location.href = 'homepage.html', 1000);
                } else {
                    const error = await response.json();
                    displayMessage('logoutMessage', `Logout failed: ${error.message}`, "error");
                }
            } catch (error) {
                console.error("Error during logout:", error);
                displayMessage('logoutMessage', "Logout failed. Please try again later.", "error");
            }
        });
    }
});





