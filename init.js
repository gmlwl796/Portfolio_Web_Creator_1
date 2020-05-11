const fs = require('fs');
const mysql = require('promise-mysql');
const dbconfig = require('./server/config/config.js').dbconfig;
const users = fs.readFileSync('./schema/pfdb_users.sql').toString();
const file = fs.readFileSync('./schema/file.sql').toString();
const portfolio = fs.readFileSync('./schema/portfolio.sql').toString();
const comment = fs.readFileSync('./schema/comment.sql').toString();

const newDBConfig = {
    "host": dbconfig["host"],
    "user": dbconfig["user"],
    "password": dbconfig["password"],
    "port": dbconfig["port"]
};

if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
    console.log(`=> make dir uploads`);
}

mysql.createConnection(newDBConfig).then(
    newDatabase => {
        newDatabase.query(`DROP DATABASE ${dbconfig["database"]}`, (err, result) => {
            console.log(`=> DB DROP ${dbconfig.database}`);

            newDatabase.query(`CREATE DATABASE ${dbconfig["database"]}`).then( () => {
                console.log(`=> DB CREATE ${dbconfig.database}`);

                mysql.createConnection(dbconfig).then( database => {
                    let query1 = database.query(users).then( () => {
                        if(err) console.log('error: ', err);
                        console.log(`=> CREATE TABLE pfdb_users`);
                    });
    
                    let query2 = database.query(file).then( () => {
                        if(err) console.log('error: ', err);
                        console.log(`=> CREATE TABLE file`);
                    });
                    
                    let query3 = database.query(portfolio).then( () => {
                        if(err) console.log('error: ', err);
                        console.log(`=> CREATE TABLE portfolio`);
                    });
                    
                    let query4 = database.query(comment).then( () => {
                        if(err) console.log('error: ', err);
                        console.log(`=> CREATE TABLE comment`);
                    });
        
                    Promise.all([query1, query2, query3, query4]).then(() => { 
                        console.log('~ init done ~');
                        process.exit(0);
                    });
                });
            });
        });
    }
);