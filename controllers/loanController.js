const db = require('../config/db');

exports.getUserLoans = (req, res) => {
    const userId = req.user.user_id;

    const query = `
        SELECT LoanAmounts.loan_id, LoanAmounts.amount, LoanAmounts.loan_date, 
               InterestRates.interest_rate
        FROM LoanAmounts
        JOIN InterestRates ON LoanAmounts.loan_id = InterestRates.loan_id
        WHERE LoanAmounts.user_id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};
