//Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table');
const connection = require('./db/connection');


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
                'Update an Employee Role'
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
                    addDeparment();
                    break;
                case 'Add a Role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an Employee role':
                    updateEmployee();
                    break;
                default:
                    console.log('SOMETHING WENT WRONG!')
            }
        })
}


init();