const mysql = require("mysql2");

// connect to database
const db = mysql.createConnection({
  host: "localhost",
  //MySQL username,
  user: "root",
  // MYSQL password
  password: "",
  database: "organization_db",
},
console.log(`connected to the organization_db database.`)
);