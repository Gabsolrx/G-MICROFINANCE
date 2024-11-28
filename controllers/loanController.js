
const db = require('../config/db'); // Import the database connection

const INTEREST_RATE = 0.02; // Fixed interest rate (2%)

// Controller to apply for a loan
exports.applyLoan = async (req, res) => {
  const { userId, loanAmount, loanTermMonths, repaymentSchedule } = req.body;

  if (!userId || !loanAmount || !loanTermMonths || !repaymentSchedule) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Calculate total repayment amount
  const totalRepayment = loanAmount + loanAmount * INTEREST_RATE * (loanTermMonths / 12);

  const query = `
    INSERT INTO loans 
    (user_id, loan_amount, loan_term_months, repayment_schedule, 
     loan_status, loan_start_date, loan_due_date, total_repayment_amount, 
     balance_due, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'pending', CURDATE(), DATE_ADD(CURDATE(), INTERVAL ? MONTH), ?, ?, NOW(), NOW());
  `;

  db.query(
    query,
    [userId, loanAmount, loanTermMonths, repaymentSchedule, loanTermMonths, totalRepayment, totalRepayment],
    (err, result) => {
      if (err) {
        console.error("Error applying for loan:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({ message: "Loan applied successfully", loanId: result.insertId });
    }
  );
};

// Controller to fetch loan details for a user
exports.getLoanDetails = async (req, res) => {
  const userId = req.params.userId;

  const query = "SELECT * FROM loans WHERE user_id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching loans:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results.map(calculateLoanDetails));
  });
};

// Function to calculate total repayment and balance due
function calculateLoanDetails(loan) {
  const totalRepayment =
    loan.loan_amount + loan.loan_amount * INTEREST_RATE * (loan.loan_term_months / 12);
  const balanceDue = totalRepayment - (loan.amount_paid || 0); // Handle case where `amount_paid` is null

  return {
    ...loan,
    total_repayment_amount: totalRepayment.toFixed(2),
    balance_due: balanceDue.toFixed(2),
  };
}











