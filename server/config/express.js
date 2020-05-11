const path = require('path');
const dbconfig = require('./config').dbconfig;
const sessionConfig = require('./config').sessionConfig;
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session); 
const bodyParser = require('body-parser');


var cookieParser = require('cookie-parser');
var app = express();
app.use(cookieParser());

app.use(cookieParser());
app.engine('html', require('ejs').renderFile);
app.set('views', './view');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/view', express.static(__dirname + '/../../view')); // resource path
app.use('/uploads', express.static(__dirname + '/../../uploads')); // upload path
app.use(bodyParser.json()); // for parsing application/json





//코드 실행하면 자동으로 session table 생김
app.use(
    session({
    secret: 'MySecretCode',
    resave: false,
    saveUninitialized: true,
    store : new MySQLStore(dbconfig)
}));

module.exports = app;