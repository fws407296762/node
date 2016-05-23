const mysql = require("mysql");
const SQL_STATE = require("./SQL_STATE");
let connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"n_news"
});

connection.on('error',function(err){
    var sqlState = err.sqlState,
        code = err.code;
    throw new Error(SQL_STATE[sqlState][code]).message;
});
connection.connect();
connection.query();
