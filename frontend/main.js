

document.addEventListener("DOMContentLoaded", () => {
    const API_URL = 'http://localhost:3000/api';

    const displayMessage = (elementId, message, type = "info") => {
        const messageDiv = document.getElementById(elementId);
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`; 
        messageDiv.style.display = "block";
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

    // Fetch User Loans on Dashboard
    const token = localStorage.getItem('token');
    if (token && document.getElementById('loan-info')) {
        fetch(`${API_URL}/loans`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch loan data.");
            }
            return response.json();
        })
        .then(data => {
            const loanInfo = document.getElementById('loan-info');
            if (data.length === 0) {
                loanInfo.innerHTML = "<p>No loans found. Start your magical journey by borrowing!</p>";
            } else {
                loanInfo.innerHTML = data.map(loan => `
                    <div class="loan">
                        <h3>Loan ID: ${loan.loan_id}</h3>
                        <p>Amount: ${loan.amount} magical coins</p>
                        <p>Interest Rate: ${loan.interest_rate}%</p>
                        <p>Loan Date: ${new Date(loan.loan_date).toLocaleDateString()}</p>
                    </div>
                `).join('');
            }
        })
        .catch(error => {
            console.error("Error fetching loan data:", error);
            document.getElementById('loan-info').innerHTML = "<p>Error loading loan information. Please try again later.</p>";
        });
    }

    // Logout Function
    window.logout = () => {
        localStorage.removeItem('token');
        displayMessage('logoutMessage', "Logged out successfully!", "success");
        setTimeout(() => window.location.href = 'index.html', 1000);
    };
});
