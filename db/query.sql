-- view all departments
SELECT * FROM  department;

-- view all roles
SELECT * FROM roles;

-- view all employees 
SELECT * FROM employees;

-- add a department
INSERT INTO department (department_name)
-- VALUES (entered by user)

-- add a role
INSERT INTO roles (title, salary, department_id)
-- VALUES (entered by user)

-- add an employee
INSERT INTO employees (first_name, last_name, role_id)
-- VALUES (entered by user)

-- update an employee role
UPDATE roles 
