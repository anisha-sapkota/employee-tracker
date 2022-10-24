# employee-tracker

Application to manage company's employee database.

## Installation

To install necessary dependencies, run the following command:

```sh
npm install
```

## Usage

- Create the required schema by sourcing `schema.sql` in `db` folder.
- Load sample data into the database by sourcing `seeds.sql` in `db` folder or add your own data.
- Update MySQL connection details in `index.js` (lines 423-428).
- Run `npm start` to start the application.
- Follow the prompts to interact with the database.

The following operations are supported:

- View All Employees
- View Employees By Manager
- View Employees By Department
- Add Employee
- Update Employee Manager
- Update Employee Role
- Delete Employee
- View All Roles
- Add Role
- Delete Role
- View All Departments
- Add Department
- Delete Department
- View Budget by Department

## Libraries used

- [console.table](https://www.npmjs.com/package/console.table)
- [inquirer](https://www.npmjs.com/package/inquirer)
- [mysql2](https://www.npmjs.com/package/mysql2)

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Helpful resources

- <https://github.com/sidorares/node-mysql2#using-promise-wrapper>
