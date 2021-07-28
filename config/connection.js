const mysql = require('mysql2');

const db = mysql.createConnection({
	host: 'localhost',
	// Your MySQL username,
	user: 'root',
	// Your MySQL password
	password: 'Fr334m3!',
	database: 'talent-finder',
});

module.exports = db;
