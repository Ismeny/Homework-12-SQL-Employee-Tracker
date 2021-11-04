//Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table');
const connection = require('./db/connection');
const util = require('util');
const { Table } = require('console-table-printer');
const { allowedNodeEnvironmentFlags } = require('process');
const { convertRawRowOptionsToStandard } = require('console-table-printer/dist/src/utils/table-helpers');

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
                // 'Delete an Employee',
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
                case 'Add an Employee':
                    inquiererEmployee();
                    break;
                case 'Update an Employee Role':
                    inquirerUpdateEmployee();
                    break;
                    // case 'Delete an Employee':
                    // inquirerDeleteEmployee();
                    // break;
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
        const rows = await query('SELECT r.id, r.title, r.salary, d.department_name AS department FROM roles r JOIN department d ON r.department_id = d.id');
        constoleTable(rows);
    } finally {
        init();
    }
}

async function getAllEmployees() {
    try {
        const rows = await query('SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, m.last_name AS manager FROM employees e LEFT JOIN roles r ON e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id LEFT JOIN employees m ON e.manager_id = m.id;');
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
            async function addDepartment(response) {
                let selAllDep = `SELECT * FROM department;`
                try {
                    //add the department to the department table
                    const { departmentName } = response;
                    await query (`INSERT INTO department (department_name) VALUES (?);`, [departmentName]);
                    //get the data from the query
                    const rows = await query(selAllDep);
                   //console table the data
                    constoleTable(rows);
                } finally {
                    init();
                }
            } addDepartment(response);
            });

}     

async function inquirerRole() {
    let allDepts = `SELECT * FROM department`
    const rows = await query(allDepts)
    constoleTable(rows)
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
                message: "From the table above, enter the department id for your new role:"
            }
        ])
        .then ((response) => {
           async function addRole(response) {
           const { roleName, roleSalary, roleDepartment } = response;
           let allRoleQuery = `SELECT * FROM roles;`
        try {
        //add the role to roles table
        await query(`INSERT INTO roles (title, salary, department_id) VALUES (?,?,?);`, [roleName, roleSalary, roleDepartment])
        //get the data from the query
        const rows = await query(allRoleQuery)
        //console Table the data
        constoleTable(rows);
    } finally {
        init();
    }
}
    addRole(response);
})
}

async function inquiererEmployee() {
    let allRoles = `SELECT * FROM roles`;
    const rows = await query (allRoles)
    console.table(rows)
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
                message: 'From the table above enter your new employees role id'
            },
            {
                type: 'input',
                name: 'employeeManager',
                message: 'What is the last name of the manager of the new employee you would like to add?'
            }
        ])
        .then((response) => {
            async function addEmployee(response) {
                const { employeeFirst, employeeLast, employeeRole, employeeManager } = response;
                const manager = await query (`SELECT id FROM employees WHERE last_name=?;`, [employeeManager]);
                const managerID = manager[0].id;
                try {
                    await query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);`, [employeeFirst, employeeLast, employeeRole, managerID])
                    const rows = await query (`SELECT * FROM employees;`);
                    console.table(rows);
                } finally {
                    init();
                }
            }
            addEmployee(response)
        });
}


async function inquirerUpdateEmployee() { 
    let allRoles = `SELECT * FROM roles`;
    const rows = await query(allRoles);
    console.table(rows)
    inquirer    
        .prompt([
            {
                type: 'input',
                name: 'employeeFirstName',
                message: "What is the employee's first name?",
            },
            {
                type: 'input',
                name: 'employeeLastName',
                message: "What is the employee's last name?",
            },
            {
                type: 'input',
                name: 'employeeRole',
                message: "From the table above, enter employee's new role NUMBER:",
            },
            {
                type: 'input',
                name: 'employeeManager',
                message: "What is the last name of the manager of the new employee?"
            }
        ])
        .then((response) => {
            async function updatedEmployee (response) {
                const { employeeFirstName, employeeLastName,employeeRole,employeeManager } = response;
                const manager = await query(`SELECT id FROM employees WHERE last_name=?;`, [employeeManager]);
                const managerID = manager[0].id;
                try {
                    await query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);`, [employeeFirstName, employeeLastName,employeeRole, managerID]);
                    const rows = await query(`SELECT * FROM employees;`);
                    console.table(rows);
                } finally {
                   init();
                }
            }
            updatedEmployee(response);
        })
        }

        
//         .then((response) => {
//                 async function updatedEmployee (response) {
//                     const { employeeFirstName, employeeRole } = response;
//                     try{
//                      await query(`UPDATE employees SET role_id=? WHERE first_name=?;`, [employeeRole, employeeFirstName]);
//                      let allEmployees = `SELECT * FROM employees;`
//                      const rows = await query(allEmployees)
//                      console.table(rows);
//                 } finally {
//                     init();
//                 }
//                     }
//                     updatedEmployee(response);
//             })
// }






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

// async function deleteEmployee(response) {
//     try{
//         const { deletedEmployee } = response;
//         const nameArr = deletedEmployee.split(' ');
//         const firstName = nameArr[0];
//         const lastName = nameArr[1];
//         await query(`DELETE FROM employees WHERE first_name=? and last_name=?;` [firstName, lastName]);
//         await query (`SELECT e.id, e.first_name, e.last_name, r.title AS role, d.department_name AS department, r.salary, m.first_name AS manager FROM employees e LEFT JOIN roles r ON e.role_id = r.id LEFT JOIN department d ON r.department_id = d.id LEFT JOIN employees m ON e.manager_id = m.id;`)
//     } finally {
//         init();
//     }
// }

init();