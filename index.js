const mysql = require("mysql2/promise");
const inquirer = require("inquirer");
const cTable = require("console.table");

const questions = [
  {
    type: "list",
    message: "What would you like to do?",
    name: "choice",
    choices: [
      "View All Employees",
      "Add Employee",
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "Quit",
    ],
  },
];

let db;

const getAll = async (type) => {
  let query;
  if (type === "department") {
    query = "SELECT * FROM department;";
  } else if (type === "role") {
    query =
      "SELECT role.id, role.title, department.name AS department, role.salary \
      FROM role \
      JOIN department ON role.department_id=department.id ORDER BY role.id;";
  } else {
    query =
      'SELECT employee.id, employee.first_name, employee.last_name, role.title, \
      department.name AS department, role.salary, CONCAT(manager.first_name, " ", \
      manager.last_name) AS manager \
      FROM employee \
      JOIN role ON employee.role_id=role.id LEFT \
      JOIN department ON role.department_id=department.id LEFT \
      JOIN employee AS manager ON employee.manager_id=manager.id';
  }
  const [rows] = await db.query(query);
  console.table(rows);
};

const addDepartment = async () => {
  const response = await inquirer.prompt([
    {
      type: "input",
      message: "What is the name of the department?",
      name: "department",
    },
  ]);
  const department = response.department;
  const query = "INSERT INTO department (name) VALUES (?)";
  await db.query(query, department);
  console.log(`Added ${department} department to the database`);
};

const addRole = async () => {
  const [data] = await db.query("SELECT * FROM department");
  const departmentsMap = {};

  for (const department of data) {
    departmentsMap[department.name] = department.id;
  }

  const response = await inquirer.prompt([
    {
      type: "input",
      message: "What is the name of the role?",
      name: "role",
    },
    {
      type: "input",
      message: "What is the salary of the role?",
      name: "salary",
      validate: (salary) => {
        const valid = /^\d+$/.test(salary);
        if (valid) {
          return true;
        } else {
          return "Please enter a valid salary";
        }
      },
    },
    {
      type: "list",
      message: "Which department does the role belong to?",
      name: "department",
      choices: Object.keys(departmentsMap),
    },
  ]);

  const query =
    "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";

  await db.query(query, [
    response.role,
    response.salary,
    departmentsMap[response.department],
  ]);

  console.log(`Added ${response.role} role to the database`);
};

const addEmployee = async () => {
  const [roles] = await db.query("SELECT id, title FROM role");
  const rolesMap = {};

  for (const role of roles) {
    rolesMap[role.title] = role.id;
  }

  const [managers] = await db.query(
    'SELECT id, CONCAT(first_name, " ", last_name) AS name \
    FROM employee where manager_id is NULL'
  );
  const managersMap = { None: null };

  for (const manager of managers) {
    managersMap[manager.name] = manager.id;
  }

  const response = await inquirer.prompt([
    {
      type: "input",
      message: "What is the employee's first name?",
      name: "firstName",
    },
    {
      type: "input",
      message: "What is the employee's last name?",
      name: "lastName",
    },
    {
      type: "list",
      message: "What is the employee's role?",
      name: "role",
      choices: Object.keys(rolesMap),
    },
    {
      type: "list",
      message: "Who is the employee's manager?",
      name: "manager",
      choices: Object.keys(managersMap),
    },
  ]);

  const query =
    "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";

  await db.query(query, [
    response.firstName,
    response.lastName,
    rolesMap[response.role],
    managersMap[response.manager],
  ]);

  console.log(
    `Added ${response.firstName} ${response.lastName} to the database`
  );
};

const updateEmployeeRole = async () => {
  const [roles] = await db.query("SELECT id, title FROM role");
  const rolesMap = {};

  for (const role of roles) {
    rolesMap[role.title] = role.id;
  }

  const [employees] = await db.query(
    'SELECT id, CONCAT(first_name, " ", last_name) AS name \
    FROM employee'
  );
  const employeesMap = {};

  for (const employee of employees) {
    employeesMap[employee.name] = employee.id;
  }

  const response = await inquirer.prompt([
    {
      type: "list",
      message: "Which employee's role do you want to update?",
      name: "employee",
      choices: Object.keys(employeesMap),
    },
    {
      type: "list",
      message: "Which role do you want to assign the selected employee?",
      name: "role",
      choices: Object.keys(rolesMap),
    },
  ]);

  const query =
    "UPDATE employee SET role_id = ? WHERE id = ?";

  await db.query(query, [
    rolesMap[response.role],
    employeesMap[response.employee],
  ]);

  console.log(
    `Updated ${response.employee}'s role`
  );
};

const init = async () => {
  db = await mysql.createConnection({
    host: "localhost",
    //MySQL username,
    user: "root",
    // MYSQL password
    password: "password",
    database: "organisation_db",
  });

  let loop = true;

  while (loop) {
    const response = await inquirer.prompt(questions);
    switch (response.choice) {
      case "Quit":
        await db.end();
        loop = false;
        break;
      case "View All Roles":
        await getAll("role");
        break;
      case "View All Departments":
        await getAll("department");
        break;
      case "View All Employees":
        await getAll("employee");
        break;
      case "Add Department":
        await addDepartment();
        break;
      case "Add Role":
        await addRole();
        break;
      case "Add Employee":
        await addEmployee();
        break;
        case "Update Employee Role":
          await updateEmployeeRole();
          break;
      default:
        break;
    }
  }
};

init();
