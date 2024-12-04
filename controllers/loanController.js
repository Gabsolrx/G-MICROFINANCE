const db = require('../config/db'); // Import the database connection

const INTEREST_RATE = 0.02; // Fixed interest rate (2%)

// Controller to apply for a loan
exports.applyLoan = async (req, res) => {
  try {
    const { userId, loanAmount, loanTermMonths, repaymentSchedule } = req.body;

    // Validate required fields
    if (!userId || !loanAmount || !loanTermMonths || !repaymentSchedule) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Parse numerical values to ensure correct data types
    const parsedLoanAmount = parseFloat(loanAmount);
    const parsedLoanTermMonths = parseInt(loanTermMonths, 10);

    // Validate numeric inputs
    if (
      isNaN(parsedLoanAmount) ||
      isNaN(parsedLoanTermMonths) ||
      parsedLoanAmount <= 0 ||
      parsedLoanTermMonths <= 0
    ) {
      return res.status(400).json({ error: "Invalid loan amount or term" });
    }

    // Calculate total repayment amount
    const totalRepayment =
      parsedLoanAmount +
      parsedLoanAmount * INTEREST_RATE * (parsedLoanTermMonths / 12);

    const query = `
      INSERT INTO loans 
      (user_id, loan_amount, loan_term_months, repayment_schedule, 
       loan_status, loan_start_date, loan_due_date, total_repayment_amount, 
       balance_due, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'pending', CURDATE(), DATE_ADD(CURDATE(), INTERVAL ? MONTH), ?, ?, NOW(), NOW());
    `;

    // Log the query and parameters before execution
    console.log("Starting loan application process...");
    console.log("Executing query:", query);
    const parameters = [
      userId,
      parsedLoanAmount,
      parsedLoanTermMonths,
      repaymentSchedule,
      parsedLoanTermMonths, // For DATE_ADD interval
      totalRepayment,
      totalRepayment, // Initial balance due
    ];
    console.log("With parameters:", parameters);

    // Execute the query
    const [result] = await db.query (query, parameters);

      // Log successful execution
      console.log("Loan application successful. Result:", result);

      // Fetch updated loan details immediately after successful application
      const fetchQuery = "SELECT * FROM loans WHERE user_id = ?";
      db.query(fetchQuery, [userId], (fetchErr, loans) => {
        if (fetchErr) {
          console.error("Error fetching updated loans:", fetchErr.message);
          return res.status(500).json({
            error: "Database error",
            details: fetchErr.message,
          });
        }

        console.log("Updated loan details fetched successfully:", loans);
        res.status(201).json({
          message: "Loan applied successfully",
          loanId: result.insertId,
          loans: loans.map(calculateLoanDetails),
        });
      });
    
  } catch (error) {
    console.error("Unexpected error in loan application:", error.message);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

// Controller to fetch loan details for a user
exports.getLoanDetails = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const query = "SELECT * FROM loans WHERE user_id = ?";
  const [results] = await db.query(query, [userId]);
  


    if (results.length === 0) {
      return res.status(404).json({ message: "No loans found for the user." });
    }

    res.status(200).json(results.map(calculateLoanDetails));
  
};

// Function to calculate total repayment and balance due
function calculateLoanDetails(loan) {
  const totalRepayment =
    loan.loan_amount +
    loan.loan_amount * INTEREST_RATE * (loan.loan_term_months / 12);
  const balanceDue = totalRepayment - (loan.amount_paid || 0); // Handle case where `amount_paid` is null

  return {
    ...loan,
    total_repayment_amount: totalRepayment,
    balance_due: balanceDue,
  };
}







// const db = require('../config/db'); // Import the database connection

// const INTEREST_RATE = 0.02; // Fixed interest rate (2%)

// // Controller to apply for a loan
// exports.applyLoan = async (req, res) => {
//   try {
//     const { userId, loanAmount, loanTermMonths, repaymentSchedule } = req.body;

//     // Validate required fields
//     if (!userId || !loanAmount || !loanTermMonths || !repaymentSchedule) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // Parse numerical values to ensure correct data types
//     const parsedLoanAmount = parseFloat(loanAmount);
//     const parsedLoanTermMonths = parseInt(loanTermMonths, 10);

//     // Validate numeric inputs
//     if (isNaN(parsedLoanAmount) || isNaN(parsedLoanTermMonths) || parsedLoanAmount <= 0 || parsedLoanTermMonths <= 0) {
//       return res.status(400).json({ error: "Invalid loan amount or term" });
//     }

//     // Calculate total repayment amount
//     const totalRepayment = parsedLoanAmount + (parsedLoanAmount * INTEREST_RATE * (parsedLoanTermMonths / 12));

//     const query = `
//       INSERT INTO loans 
//       (user_id, loan_amount, loan_term_months, repayment_schedule, 
//        loan_status, loan_start_date, loan_due_date, total_repayment_amount, 
//        balance_due, created_at, updated_at)
//       VALUES (?, ?, ?, ?, 'pending', CURDATE(), DATE_ADD(CURDATE(), INTERVAL ? MONTH), ?, ?, NOW(), NOW());
//     `;

//     // Log the query and parameters before execution
//     console.log("Starting loan application process...");
//     console.log("Executing query:", query);
//     const parameters = [
//       userId,
//       parsedLoanAmount,
//       parsedLoanTermMonths,
//       repaymentSchedule,
//       parsedLoanTermMonths, // For DATE_ADD interval
//       totalRepayment,
//       totalRepayment, // Initial balance due
//     ];
//     console.log("With parameters:", parameters);

//     // Execute the query
//     db.query(query, parameters, (err, result) => {
//       if (err) {
//         console.error("Error applying for loan:", err.message);
//         return res.status(500).json({ error: "Database error", details: err.message });
//       }

//       // Log successful execution
//       console.log("Loan application successful. Result:", result);

//       // Send the response
//       res.status(201).json({ message: "Loan applied successfully", loanId: result.insertId });
//     });
//   } catch (error) {
//     console.error("Unexpected error in loan application:", error.message);
//     res.status(500).json({ error: "Internal server error", details: error.message });
//   }
// };

// // Controller to fetch loan details for a user
// exports.getLoanDetails = async (req, res) => {
//   const userId = req.params.userId;

//   if (!userId) {
//     return res.status(400).json({ error: "User ID is required" });
//   }

//   const query = "SELECT * FROM loans WHERE user_id = ?";
//   db.query(query, [userId], (err, results) => {
//     if (err) {
//       console.error("Error fetching loans:", err.message);
//       return res.status(500).json({ error: "Database error", details: err.message });
//     }

//     res.status(200).json(results.map(calculateLoanDetails));
//   });
// };

// // Function to calculate total repayment and balance due
// function calculateLoanDetails(loan) {
//   const totalRepayment =
//     loan.loan_amount + loan.loan_amount * INTEREST_RATE * (loan.loan_term_months / 12);
//   const balanceDue = totalRepayment - (loan.amount_paid || 0); // Handle case where `amount_paid` is null

//   return {
//     ...loan,
//     total_repayment_amount: totalRepayment.toFixed(2),
//     balance_due: balanceDue.toFixed(2),
//   };
// }








