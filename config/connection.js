const mysql = require('mysql2');
// require('dotenv').config();
const db = mysql.createConnection({
	host: 'localhost',
	// Your MySQL username,
	user: 'root',
	// Your MySQL password
	password: 'Fr334m3!',
	database: 'talent',
});

module.exports = db;
