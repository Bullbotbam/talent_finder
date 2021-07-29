INSERT INTO departments
  (department_name)
VALUES
  ('Human Resources'),
  ('Engineering'),
  ('Marketing'),
  ('R & D'),
  ('Sales');


INSERT INTO employee_roles
  (title, salary, department_id)
VALUES
  ('Salesperson', 95000, '5'),
  ('Lead Engineer', 120000, '2'),
  ('Engineer', 80000, '2'),
  ('UX Designer', 90000, '4'),
  ('Researcher', 100000, '4'),
  ('HR Lead', 75000, '1'),
  ('Senior Dev Ops', 84000, '2'),
  ('Developer', 94000, '2');
 

INSERT INTO employees
  (first_name, last_name, role_id, manager_id)
VALUES
  ('Ronald', 'Firbank', 1, 1),
  ('Virginia', 'Woolf', 1, NULL),
  ('Piers', 'Gaveston', 1, NULL),
  ('Charles', 'LeRoi', 2, NULL),
  ('Katherine', 'Mansfield', 2, NULL),
  ('Dora', 'Carrington', 3, NULL),
  ('Edward', 'Bellamy', 3, 1),
  ('Montague', 'Summers', 3, NULL),
  ('Octavia', 'Butler', 3, NULL),
  ('Unica', 'Zurn', NULL, NULL);
  