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
      "SELECT role.id, role.title, department.name as department, role.salary FROM role JOIN department ON role.department_id=department.id ORDER BY role.id;";
  } else {
    query =
      'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, concat(manager.first_name, " ", manager.last_name) AS manager FROM employee JOIN role ON employee.role_id=role.id LEFT JOIN department ON role.department_id=department.id LEFT JOIN employee AS manager ON employee.manager_id=manager.id;';
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
      default:
        break;
    }
  }
};

init();
