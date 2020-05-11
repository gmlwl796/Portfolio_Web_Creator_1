const dbconfig = require('../config/config.js').dbconfig;
const mysql = require('mysql'); //mysql 건들임
const database = mysql.createConnection(dbconfig);

database.connect( err => {
    if (err) throw err;
    console.log("MySQL Connected!");
});

module.exports = database;