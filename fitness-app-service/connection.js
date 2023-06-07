const mysql = require("mysql");
const dotenv = require('dotenv');

dotenv.config();

var mysqlConnection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,    
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE, 
    multipleStatements: true   
});

mysqlConnection.connect((err) => {
    if(!err) {
        console.log("Database Connected!");
        console.log("-----------------------------------------");
        console.log("Express application started successfully!");
        console.log("-----------------------------------------");
    } else {
        console.log("Database Connection Failed!");
    }
});

module.exports = mysqlConnection;