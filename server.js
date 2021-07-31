// const express = require('express');
const db = require('./config/connection');
// const apiRoutes = require('./routes/apiRoutes');
const inquirer = require('inquirer');

// const PORT = process.env.PORT || 3001;
// const app = express();

// // Express middleware
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// Use apiRoutes
// app.use('/api', apiRoutes);

// Default response for any other request (Not Found)
// app.use((req, res) => {
// 	res.status(404).end();
// });

const appSetUp = () => {
	return inquirer
		.prompt([
			{
				type: 'list',
				name: 'employeePrompt',
				message: 'What would you like to do?',
				choices: [
					'View All Employees',
					'View All Employees by Department',
					'View All Employees by Manager',
					'Add an Employee',
					'Remove an Employee',
					'Update an Employee Role',
					'Update an Employee Manager',
				],
			},
		])
		.then(function (responses) {
			switch (responses.employeePrompt) {
				case 'View All Employees':
					viewAll();
					break;
				case 'View All Employees by Department':
					viewAllByDepartment();
					break;
				case 'View All Employees by Manager':
					viewAllByManager();
					break;
				case 'Add Employee':
					addEmployee();
					break;
			}
		});
};
// to view all employees
function viewAll() {
	const research = `SELECT * FROM employees`;

	db.query(research, function (err, res) {
		console.table(res);
		appSetUp();
	});
}

// to view all employees by department
function viewAllByDepartment() {
	const research = `SELECT * FROM employees LEFT JOIN departments ON employees.role_id = departments.id`;

	db.query(research, function (err, res) {
		console.table(res);
		appSetUp();
	});
}
// to view all employees by manager

//gather all managers then prompt(list) choose
function viewAllByManager() {
	const research = `SELECT * FROM employees WHERE manager_id = ?`;

	db.query(research, function (err, res) {
		console.table(res);
		appSetUp();
	});
}

// to add and employee
async function addEmployee() {
	const research = `INSERT INTO employees SET ?`;

	await db.query(research, function (err, res) {
		console.table(res);
		appSetUp();
	});
	inquirer.prompt([
		{
			type: 'input',
			name: 'firstName',
			message: "What is the employee's first name?",
			validate: (nameInput) => {
				if (nameInput) {
					return true;
				} else {
					console.log('You need to enter a first name for this employee.');
					return false;
				}
			},
		},
		{
			type: 'input',
			name: 'lastName',
			message: "What is the employee's last name?",
			validate: (nameInput) => {
				if (nameInput) {
					return true;
				} else {
					console.log('You need to enter a last name for this employee.');
					return false;
				}
			},
		},
		{
			type: 'input',
			name: 'roleID',
			message: 'What role will this employee have?',
			validate: (nameInput) => {
				if (nameInput) {
					return true;
				} else {
					console.log('You need to enter a role for this employee.');
					return false;
				}
			},
		},
		{
			type: 'input',
			name: 'managerID',
			message: 'What is the manager for this employee?',
			validate: (nameInput) => {
				if (nameInput) {
					return true;
				} else {
					console.log('You need to enter a manager for this employee.');
					return false;
				}
			},
		},
	]);
}

appSetUp();
// {

// 		{
// 			type: 'list',
// 			name: 'employeesRemoved',
// 			message: 'What would you like to do?',
// 			choices: [
// 				'View All Departments',
// 				'View All Roles',
// 				'View All Employees',
// 				'Add a Department',
// 				'Add a Role',
// 				'Add an Employee',
// 				'Update an Employee Role',
// 			],
// 		},
// 		{
// 			type: 'input',
// 			name: 'addAnEmployeeFirstName',
// 			message: "What is the employee's first name?(Required)",
// 			validate: (nameInput) => {
// 				if (nameInput) {
// 					return true;
// 				} else {
// 					console.log('You need to enter a first name for this employee.');
// 					return false;
// 				}
// 			},
// 		},
// 		{
// 			type: 'input',
// 			name: 'addAnEmployeeLastName',
// 			message: "What is the employee's last name?(Required)",
// 			validate: (nameInput) => {
// 				if (nameInput) {
// 					return true;
// 				} else {
// 					console.log('You need to enter a last name for this employee.');
// 					return false;
// 				}
// 			},
// 		},
// 		{
// 			type: 'list',
// 			name: 'addAnEmployeeRole',
// 			message: "What is the employee's role?",
// 			choices: [
// 				'Sales Lead',
// 				'Salesperson',
// 				'Lead Engineer',
// 				'Software Engineer',
// 				'Account Manager',
// 				'Accountant',
// 				'Legal Team Lead',
// 			],
// 		},
// 		{
// 			type: 'list',
// 			name: 'findAnEmployeeManager',
// 			message: "Who is the employee's manager?",
// 			choices: ['None', 'John Doe', '', '', '', '', ''],
// 		},
// 		{
// 			type: 'list',
// 			name: 'updateAnEmployeeManager',
// 			message: "Which employee's manager do you want to update?",
// 			choices: ['Nancy Willis', 'John Doe', '', '', '', '', ''],
// 		},
// 		{
// 			type: 'list',
// 			name: 'makeEmployeeManager',
// 			message:
// 				'Which employee do you want to set as manager for the selected employee?',
// 			choices: ['Nancy Willis', 'John Doe', '', '', '', '', ''],
// 		},
// 	]);
// };

// Start server after DB connection
// db.connect((err) => {
// 	if (err) throw err;
// 	console.log('Database connected.');
// 	app.listen(PORT, () => {
// 		console.log(`Server running on port ${PORT}`);
// 	});
// });
