INSERT INTO department (department_name)
VALUES  ("Marketing"),
        ("Finance"),
        ("Human Resources"),
        ("Management"),
        ("Sales"),
        ("Engineering"),
        ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES  ("Social Media Marketer", 60000, 1),
        ("Banker", 70000, 2),
        ("HR Compliance Officer", 50000, 3),
        ("Manager", 100000,4),
        ("Salesperson", 42000, 5),
        ("Senior Software Engineer", 500000, 6),
        ("Lawyer", 140000, 7);





INSERT INTO employees (first_name, last_name, role_id)
VALUES  ("Rachel", "Green", 6),
        ("Monica", "Geller", 2),
        ("Chandler", "Bing", 7),
        ("Phoebe", "Buffay", 1),
        ("Ross", "Geller", 4),
        ("Joey", "Tribbiani", 7),
        ("Mike", "Hannigan", 3),
        ("Janice", "Goralnik", 3),
        ("Richard", "Burke", 5),
        ("Jill", "Green", 1),
        ("Charlie", "Wheeler", 2),
        ("Amy", "Green", 1),
        ("Jack", "Geller", 2),
        ("Judy", "Geller", 4),
        ("Sarah", "Tuttle", 6);

UPDATE employees
SET manager_id = 13
WHERE role_id IN (1,3,4,5,6,7)