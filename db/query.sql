-- view all departments
SELECT * FROM  department;

-- view all roles
SELECT r.id, title, salary, d.department_name AS department
FROM roles r
JOIN deparments d ON r.department_id = d.id

-- view all employees 
SELECT e.id e.first_name, e.last_name, r.title AS role, d.department_name AS department, r.salary, m.first_name AS manager
FROM employees e
LEFT JOIN roles r ON e.role_id = r.id
LEFT JOIN department d ON r.department_id = d.id
LEFT JOIN employees m ON e.manager_id = m.id;

-- all managers
SELECT e.first_name, e.last_name, m.last_name AS manager
FROM employees e
JOIN employees m ON e.manager_id = m.id;

-- add a department
INSERT INTO department (department_name)
-- VALUES ('new department');

-- add a role
INSERT INTO roles (title, salary, department_id)
-- VALUES ('new role title', 90000, 2);

-- add an employee
INSERT INTO employees (first_name, last_name, role_id)
-- VALUES ('tommy', 'hilgiger', 1);

-- update an employee role
UPDATE employees
SET role_id = ?
WHERE first_name = "whatever user chose" ;


-- current role titles
-- SELECT title FROM roles;

let rolesArr = query('SELECT title FROM roles;')

[{title: "this"}, {title: "this instead"}, ]

let newArray = [];

for (let role of rolesArr) {
    newArray.push(role.title);
}

inquirer.prompt ([
    {
        type: "list",
        choices: newArray
    }
])