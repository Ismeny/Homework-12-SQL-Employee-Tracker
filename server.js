//Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table');
const connection = require('./db/connection');

// //connect to database
// const db = mysql.createConnection (
//     {
//         host:'localhost',
//         user:'root',
//         password:'budnova2021',
//         database: 'friends_db'
//     },
//     console.log('Connected to the friends_db database.')
// )

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
            ]

        }])
        .then((answers) => {
            // switch case?? if they choose view all departments- show all depts/
        })
}