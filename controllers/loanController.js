

// Function to get user loans with all related details
exports.getUserLoans = async (req, res) => {
    const userId = req.user.user_id;

    const query = `
    SELECT 
        l.loan_id,
        l.amount AS loan_amount,
        l.loan_date,
        ir.interest_rate,
        rs.schedule_id,
        rs.repayment_date,
        rs.amount_due,
        th.transaction_id,
        th.transaction_date,
        th.amount AS transaction_amount,
        th.description AS transaction_description
    FROM loans l
    LEFT JOIN interest_rates ir ON l.loan_id = ir.loan_id
    LEFT JOIN repayment_schedules rs ON l.loan_id = rs.loan_id
    LEFT JOIN transaction_histories th ON l.loan_id = th.loan_id
    WHERE l.user_id = ?
    ORDER BY l.loan_id, rs.repayment_date, th.transaction_date;
    `;

    console.log(`Fetching loans and related data for user with ID: ${userId}`);

    try {
        // Execute the query
        const [results] = await db.query(query, [userId]);

        // Check if results are empty
        if (results.length === 0) {
            console.log(`No loans found for user with ID: ${userId}`);
            return res.status(404).json({ message: 'No loans found for this user.' });
        }

        // Return the fetched loans and related data
        console.log(`Found ${results.length} loan(s) and related data for user with ID: ${userId}`);
        res.status(200).json(results);
    } catch (err) {
        // Enhanced error handling and debugging
        console.error(`Error fetching loans for user with ID: ${userId}`, err);

        // Return an error response with the error message
        res.status(500).json({ error: 'An error occurred while fetching loans.', details: err.message });
    }
};





















