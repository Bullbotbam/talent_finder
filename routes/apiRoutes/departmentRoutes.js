const express = require('express');
const router = express.Router;
const db = require('../../config/connection');

// Get all departments
router.get('/department', (req, res) => {
	db.query(sql, (err, rows) => {
		if (err) {
			res.status(500).json({ error: err.message });
			return;
		}
		res.json({
			message: 'success',
			data: rows,
		});
	});
});
module.exports = router;
