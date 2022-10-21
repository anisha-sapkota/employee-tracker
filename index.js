const mysql = require("mysql2");
const inquirer = require("inquirer");

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

// connect to database
// const db = mysql.createConnection({
//   host: "localhost",
//   //MySQL username,
//   user: "root",
//   // MYSQL password
//   password: "",
//   database: "organization_db",
// },
// console.log(`connected to the organization_db database.`)
// );

const init = async () => {
  let loop = true;

  while (loop) {
    const response = await inquirer.prompt(questions);
    switch (response.choice) {
      case "Quit":
        loop = false;
        break;
      default:
        break;
    }
  }
};

init();
