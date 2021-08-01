// const express = require('express');
const db = require('./config/connection');
// const apiRoutes = require('./routes/apiRoutes');
const inquirer = require('inquirer');

const figlet = require('figlet');

console.log(
	figlet.textSync('Talent Finder', {
		font: 'big',
		horizontalLayout: 'default',
		verticalLayout: 'default',
		width: 80,
		whitespaceBreak: true,
	})
);

const appSetUp = () => {
	return inquirer
		.prompt([
			{
				type: 'list',
				name: 'employeePrompt',
				message: 'What would you like to do?',
				choices: [
					'QUIT!!!',
					'View All Employees',
					'View All Departments',
					'View All Roles',
					'View All Employees by Department',
					'View All Employees by Manager',
					'Add an Employee',
					'Add an Department',
					'Add an Role',
					'Remove an Employee',
					'Update an Employee Role',
					'Update an Employee Manager',
				],
			},
		])
		.then(function (responses) {
			switch (responses.employeePrompt) {
				case 'QUIT!!!':
					WantToExit();
					break;
				case 'View All Employees':
					allEmployees();
					break;
				case 'View All Departments':
					allDepartments();
					break;
				case 'View All Roles':
					allRoles();
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
				case 'Remove Employee':
					addEmployee();
					break;
				case 'Update Employee Role':
					addEmployee();
					break;
				case "Update Employee's Manager":
					addEmployee();
					break;
			}
		});
};

// quit program
const WantToExit = () =>
	inquirer
		.prompt([
			{
				name: 'moreQuery',
				type: 'confirm',
				message: 'Would you like to start over?',
			},
		])
		.then((answer) => {
			if (answer.moreQuery) return appSetUp();
		});

// to view all employees
function allEmployees() {
	const research = `SELECT * FROM employees`;

	db.query(research, function (err, res) {
		console.table(res);
		appSetUp();
	});
}

// to view all departments
function allDepartments() {
	const research = `SELECT * FROM departments`;

	db.query(research, function (err, res) {
		console.table(res);
		appSetUp();
	});
}
// to view all roles
function allRoles() {
	const research = `SELECT * FROM employee_roles`;

	db.query(research, function (err, res) {
		console.table(res);
		appSetUp();
	});
}
// add a roles
function addRoles() {
	const research = `SELECT * FROM employee_roles`;

	db.query(research, function (err, res) {
		console.table(res);
		appSetUp();
	});
	{
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
	}
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
	const research =
		// 'SELECT title, CONCAT(employees.first_name, " ", employees.last_name) AS EmployeeName,  salary, department_name, employees.first_name AS manager_first_name, employees.last_name AS manager_last_name FROM employees INNER JOIN employee_roles ON employees.manager_id = employee_roles.id INNER JOIN departments ON employee_roles.department_id = departments.id LEFT JOIN employees AS employees_manager ON employees.manager_id = employees.id;';

		`SELECT employees.id, employees.first_name, employees.last_name, title, salary, department_name, employees.first_name AS manager_first_name, employees.last_name AS manager_last_name FROM employees INNER JOIN employee_roles ON employees.manager_id = employee_roles.id INNER JOIN departments ON employee_roles.department_id = departments.id LEFT JOIN employees AS employees_manager ON employees.manager_id = employees.id;`;
	console.log('research', research);
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
	inquirer
		.prompt([
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
				name: 'role',
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
				name: 'manager',
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
		])

		.then(({ firstName, lastName, role, manager }) => {
			if (manager == 0) {
				manager = null;
			}
			queries.addEmployee(firstName, lastName, role, manager);
			this.appSetUp();
		});
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
