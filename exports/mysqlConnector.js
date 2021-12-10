require('dotenv').config();

var mysql = require("mysql");

var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.darkrphost,
    user: process.env.darkrpuser,
    password: process.env.darkrppw,
    database: process.env.darkrpdb
});
module.exports = pool;