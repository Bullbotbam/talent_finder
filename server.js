const db = require('./config/connection');
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
					'Remove a Role',
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
				case 'Remove a Role':
					deleteRole();
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
	const research = `SELECT employees.id, employees.first_name, employees.last_name, title, salary, department_name, employees.first_name AS manager_first_name, employees.last_name AS manager_last_name FROM employees INNER JOIN employee_roles ON employees.manager_id = employee_roles.id INNER JOIN departments ON employee_roles.department_id = departments.id LEFT JOIN employees AS employees_manager ON employees.manager_id = employees.id;`;

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
			allDepartments();
			appSetUp();
		}
	);
}
// to update a department
async function updateRole(id, roleID) {
	let [rows, fields] = await db.query(`UPDATE employees SET ? WHERE ?`, [
		{ role_id: roleID },
		{ id: id },
	]);

	appSetUp();

	// console.table(rows);
	return rows;
}
// to add a new role
async function addRoles() {
	const roleInfo = await inquirer.prompt([
		{
			type: 'input',
			message: 'What is the name of the new role?',
			name: 'title',
		},
		{
			type: 'input',
			message: 'What is the salary of the new role?',
			name: 'salary',
		},
		{
			type: 'input',
			message: 'What is the department_id of the new role?',
			name: 'department_id',
		},
	]);
	db.query(
		'INSERT INTO employee_roles SET ?',
		{
			title: roleInfo.title,
			salary: roleInfo.salary,
			department_id: roleInfo.department_id,
		},
		function (err) {
			if (err) throw err;
			console.log('New role was added successfully!');
			allRoles();
			appSetUp();
		}
	);
}

// to add an employee

async function addEmployee() {
	const employees = db.query('SELECT * FROM employees');
	const roles = db.query('SELECT * FROM employee_roles');

	const newEmployee = await inquirer.prompt([
		{
			type: 'input',
			name: 'first_name',
			message: 'Please enter first name of new employee:',
		},
		{
			type: 'input',
			name: 'last_name',
			message: 'Please enter the last name of new employee:',
		},
	]);
	const roleChoice = roles.map(({ id, title }) => ({
		name: title,
		value: id,
	}));
	const { role_id } = await prompt({
		type: 'list',
		name: 'role_id',
		message: 'What is their role? ',
		choices: roleChoice,
	});
	newEmployee.role_id = role_id;

	const selectManager = employees.map(({ id, first_name, last_name }) => ({
		name: `${first_name} ${last_name} `,
		value: id,
	}));

	const { manager_id } = await prompt({
		type: 'list',
		name: 'manager_id',
		message: 'Who will manage this employee?',
		choices: selectManager,
	});
	newEmployee.manager_id = manager_id;

	await db.createEmployee(newEmployee);
	console.table(
		`${newEmployee.first_name} ${newEmployee.last_name} was added to list.`
	);
	appSetUp();
}

async function deleteRole() {
	db.query('SELECT * FROM employee_roles', async (err, role) => {
		const roleRemoval = await inquirer.prompt([
			{
				type: 'list',
				name: 'title',
				message: 'Which role do you wish to remove?',
				choices: () => {
					return role.map((role) => role.title);
				},
			},
		]);
		console.log(roleRemoval);
		db.query(
			`DELETE FROM employee_roles WHERE ?`,
			{
				title: roleRemoval.title,
			},
			function (err, res) {
				if (err) throw err;
				console.log('This role has been removed.');
				allRoles();
				appSetUp();
			}
		);
	});
}

appSetUp();
