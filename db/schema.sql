DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS employee_roles;
DROP TABLE IF EXISTS departments;

-- CREATE DATABASE talent;

-- USE talent;

CREATE TABLE departments(
  id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
  department_name VARCHAR(30)
);

CREATE TABLE employee_roles(
  id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
  title VARCHAR(30),
  salary DECIMAL(10,2),
department_id INTEGER,
  CONSTRAINT fk_employees
    FOREIGN KEY (department_id)
    REFERENCES departments(id)
    ON DELETE SET NULL
);

CREATE TABLE employees(
  id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INTEGER,
  manager_id INTEGER,
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES
  employee_roles(id) ON DELETE CASCADE,
  CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES
  employees(id) ON DELETE CASCADE
);

