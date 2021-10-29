//Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table');
const connection = require('./db/connection');
const util = require('util');
const { Table } = require('console-table-printer');
const { allowedNodeEnvironmentFlags } = require('process');

const query = util.promisify(connection.query).bind(connection);

// helper function that we created
function constoleTable(rows) {
    const table = new Table();
    table.addRows(rows);
    table.printTable();
}

// start prompts
function init() {
    inquirer
        .prompt([{
            type: 'list',
            name: 'mainMenu',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employee Role',
                'Delete an Employee',
                'Exit'
            ]
        }])
        .then((response) => {
            switch(response.mainMenu) {
                case 'View All Departments':
                    getAllDepts();
                    break;
                case 'View All Roles':
                    getAllRoles();
                    break;
                case 'View All Employees':
                    getAllEmployees();
                    break;
                case 'Add a Department':
                    inquiererDeparment();
                    break;
                case 'Add a Role':
                    inquirerRole();
                    break;
                case 'Add an employee':
                    inquiererEmployee();
                    break;
                case 'Update an Employee role':
                    inquirerUpdateEmployee();
                    break;
                    case 'Delete an Employee':
                    inquirerDeleteEmployee();
                    break;
                case 'Exit':
                    connection.end();
                    break;
                default:
                    console.log('SOMETHING WENT WRONG!')
            }
        })
}

async function getAllDepts() {
    try {
        // Get the data from the query
        const rows = await query('SELECT * FROM  department');
        //console table the data
        constoleTable(rows);
    } finally {
        init();
    }
}

async function getAllRoles() {
    try {
        const rows = await query('SELECT r.id, title, salary, d.department_name AS department FROM roles r JOIN department d ON r.department_id = d.id');
        constoleTable(rows);
    } finally {
        init();
    }
}

async function getAllEmployees() {
    try {
        const rows = await query('SELECT e.first_name, e.last_name, m.last_name AS manager FROM employees e JOIN employees m ON e.manager_id = m.id');
        constoleTable(rows);
    } finally {
        init();
    }
}

async function inquiererDeparment() {
   inquirer
        .prompt ([
            {
                type: 'input',
                name: 'departmentName',  
                message: 'What is the name of the new department you would like to add?'    
            }
        ])
        .then ((response) => {
            addDepartment(response);
        });
    }

async function addDepartment(response) {
        //get the department name from response
        const { departmentName } = response;
        try {
            //add the department to the department table
            await query (`INSERT INTO department (department_name) VALUES (?);`, [departmentName]);
            //get the data from the query
            const rows = await query('SELECT * FROM departments;');
           //console table the data
            constoleTable(rows);
        } finally {
            init();
        }
    }

async function inquirerRole() {
    inquirer
        .prompt ([
            {
                type: 'input',
                name: 'roleName',
                message: 'What is the name of the new role you like to add?'
            },
            {
                type: 'input',
                name: 'roleSalary',
                message: 'What is the salary of the new role you like to add?'
            },
            {
                type: 'input',
                name: 'roleDepartment',
                message: 'What is the department of the new role you like to add?'
            }
        ])
        .then ((response) => {
            addRole(response);
        });
}

async function addRole(response) {
    //get the role data from the response
    const { roleName, roleSalary, roleDepartment } = response;
    const deptIdArr = await query(`SELECT id FROM department WHERE department_name = ${roleDepartment}`)
    const deptId = deptIdArr[0].id;
    try {
        //add the role to roles table
        await query(`INSERT INTO roles (title, salary, department_id) VALUES (${roleName}, ${roleSalary}, ${deptId});`)
        //get the data from the query
        const rows = await query('');
        //console Table the data
        constoleTable(rows);
    } finally {
        init();
    }
}

async function inquiererEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'employeeFirst',
                message: 'What is the first name of the new employee you like to add?'
            },
            {
                type: 'input',
                name: 'employeeLast',
                message: 'What is the last name of the new employee you like to add?'
            },
            {
                type: 'input',
                name: 'employeeRole',
                message: 'What is the name of the role of the new employee you would like to add?'
            },
            {
                type: 'input',
                name: 'employeeManager',
                message: 'What is the last name of the manager of the new employee you would like to add?'
            }
        ])
        .then((response) => {
            addEmployee(response);
        });
}

async function addEmployee(response) {
    //get the employee data from the response
    const { employeeFirst, employeeLast, employeeRole, employeeManager } = response;
    const roleIdArr = await query(`SELECT id FROM roles WHERE title =?;`,[employeeRole]);
    const roleId = roleIdArr[0].id;
    const empIdArr = await query(`SELECT id FROM employees WHERE last_name=?,`, [employeeManager]);
    const managerId = empIdArr[0].id;
    try {
        //add the employee to employees table
        await query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);`, [employeeFirst, employeeLast, roleId, managerId])
        //get the data from the query
        const rows = await query('SELECT e.id e.first_name, e.last_name, r.title AS role, d.department_name AS department, r.salary, m.first_name AS manager FROM employees e LEFT JOIN roles r ON e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id LEFT JOIN employees m ON e.manager_id = m.id;');
        //console Table the data
        constoleTable(rows);
    } finally {
        init();
    }
}

let employeeNames = [];
async function getCurrentEmployees() {
    const employeeData = await query(`SELECT first_name, last_name FROM employees;`);
    for (let i = 0; i < employeeData.length; i++) {
        let firstName = employeeData[i].first_name;
        let lastName = employeeData[i].last_name;
        employeeNames.push(`${firstName} ${lastName}`)
    }
    return employeeNames;
}

async function inquirerUpdateEmployee() {
    let currentEmployees = await getCurrentEmployees();
    inquirer    
        .prompt([
            {
                type: 'list',
                name: 'chosenEmployee',
                message: 'Which employee would you like to update?',
                choices: currentEmployees
            },
            {
                type: 'input',
                name: 'chosenRole',
                message: 'What new role would you like this employee to have?',
                choices: currentEmployees
            }
        ])
        .then((response) => {
            updateEmployee(response);
        });
}

async function updateEmployee(response) {
        try {
            const { chosenEmployee, chosenRole } = response;
            const nameArr = chosenEmployee.split(' ');
            const firstName = nameArr[0];
            const lastName = nameArr[1];
            const roleIdArr = await query(`SELECT id FROM roles WHERE title=?;`, [chosenRole]);
            const roleId = roleIdArr[0].id;

            await query (`UPDATE employees SET role_id=? WHERE first_name=? and last_name=?;`, [roleId, firstName, lastName]);
            //get the data from the query
            const rows = await query('UPDATE employees SET role_id=? WHERE first_name=? AND last_name?;', [
                roleId,
                firstName,
                lastName
            ]);
           //console table the data
            constoleTable(rows);
        } finally {
            init();
        }
}

async function inquirerDeleteEmployee() {
    const currentEmployees = await getCurrentEmployees();
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'deletedEmployee',
                message: 'What employee do you want to delete?',
                choices: currentEmployees
            }
        ])
        .then((response) => {
            deleteEmployee(response);
        });
}

async function deleteEmployee(response) {
    try{
        const { deletedEmployee } = response;
        const nameArr = deletedEmployee.split(' ');
        const firstName = nameArr[0];
        const lastName = nameArr[1];
        await query(`DELETE FROM employees WHERE first_name=? and last_name=?;` [firstName, lastName]);
        await query (`SELECT e.id, e.first_name, e.last_name, r.title AS role, d.department_name AS department, r.salary, m.first_name AS manager FROM employees e LEFT JOIN roles r ON e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id LEFT JOIN employees m ON e.manager_id = m.id;`)
    } finally {
        init();
    }
}

init();