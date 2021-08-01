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
					'Start Again from the top!!!',
					'View All Employees',
					'View All Departments',
					'View All Roles',
					'View All Managers',
					'View All Employees by Department',
					'View All Employees by Manager',
					'View All Roles by Department',
					'Add an Employee',
					'Add an Department',
					'Add an Role',
					'Remove an Employee',
					'Update an Employee Role',
					'Update an Employee Manager',
					'QUIT!!!',
				],
			},
		])
		.then(function (responses) {
			switch (responses.employeePrompt) {
				case 'Start Again from the top!!!':
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
				case 'View All Managers':
					allManagers();
					break;
				case 'View All Employees by Department':
					viewAllByDepartment();
					break;
				case 'View All Employees by Manager':
					viewAllByManager();
					break;
				case 'View All Roles by Department':
					allRolesByDepartment();
					break;
				case 'Add an Employee':
					addEmployee();
					break;
				case 'Add an Role':
					addRoles();
					break;
				case 'Add an Department':
					addDepartment();
					break;
				case 'Remove an Employee':
					deleteEmployee();
					break;
				case 'Update Employee Role':
					updateRole();
					break;
				case "Update Employee's Manager":
					updateManager();
					break;
				case 'QUIT!!!':
					db.end();
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
	const research = `SELECT CONCAT(first_name, ' ', last_name) as Name FROM employees`;

	db.query(research, function (err, res) {
		console.table(res);
		appSetUp();
	});
}
// to view all managers
function allManagers() {
	const research = `SELECT DISTINCT
    
    CONCAT(employees.first_name, employees.last_name) AS Managers
FROM
    employees, employee_roles
    WHERE employees.manager_id = employee_roles.id;`;

	db.query(research, function (err, res) {
		console.table(res);
		appSetUp();
	});
}

// to view all departments
function allDepartments() {
	const research = `SELECT department_name AS Departments FROM departments`;

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
// to view all roles by department
function allRolesByDepartment() {
	const research = `SELECT DISTINCT title, salary, department_name
	FROM employee_roles, departments
	WHERE employee_roles.department_id = departments.id;`;

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
// to add a new department
async function addDepartment() {
	const departmentInfo = await inquirer.prompt([
		{
			type: 'input',
			message: 'What is the name of your department?',
			name: 'department_name',
		},
	]);
	db.query(
		'INSERT INTO departments SET ?',
		{
			department_name: departmentInfo.department_name,
		},
		function (err) {
			if (err) throw err;
			console.log('New department was added successfully!');
			appSetUp();
		}
	);
}

// to add and employee

// async function addEmployee(roles, employees) {
// 	const employee_roles = await db.query('SELECT * FROM roles');
// 	const roles = employee_roles.map(({ id, title }) => ({
// 		name: title,
// 		value: id,
// 	}));
// 	const newEmployee = await inquirer.prompt([
// 		{
// 			type: 'input',
// 			name: 'first_name',
// 			message: 'First name: ',
// 		},
// 		{
// 			type: 'input',
// 			name: 'last_name',
// 			message: 'Last name: ',
// 		},
// 		{
// 			type: 'list',
// 			name: 'role_id',
// 			message: 'What is their role? ',
// 			choices: roles,
// 		},
// 		{
// 			type: 'list',
// 			name: 'manager_id',
// 			message: 'Who is the manager for this employee?',
// 			choices: employees,
// 		},
// 	]);
// 	const research = await db.query('INSERT INTO employees SET ?', employee);
// 	console.table(research);
// 	pickToDo();
// }
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
