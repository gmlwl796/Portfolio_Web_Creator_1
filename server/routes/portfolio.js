const conn = require('../database/db');
const route = require('express').Router();
var fs = require('fs'),
    pdf = require('html-pdf'),
    path = require('path'),
    ejs = require('ejs');
var request = require("request");
var scrape = require('website-scraper');
var EasyZip = require('easy-zip').EasyZip;

route.get('/', function(req,res) {
    var sql = 'SELECT portfolio.pid, portfolio.id, users.displayName, users.email FROM users, portfolio where portfolio.id = users.id';
    conn.query(sql, function(err,portfolio,fields){
        if(req.user && req.user.displayName) {
              res.render('ejs/smain.ejs', {users:req.user, portfolio:portfolio});
        } else{
            res.render('ejs/main.ejs', {portfolio:portfolio});
        }
    });
});

route.get('/me', (request, response) => {
    let sql = 'SELECT temp, introduce, skills, careers, phone, homepage FROM portfolio WHERE id=?';
    let id = request.user.id;
    conn.query(sql, id, (err, result) => {
        if (err) {
            throw err;
            console.log(err);
        } else {
            response.status(200).send(result[0]);
        }
    });
});

route.get(['/:id'], function(req,res) {
    var id = req.params.id;
    var sql = 'SELECT users.id, portfolio.id, users.profileImg, portfolio.temp, portfolio.introduce,portfolio.skills,portfolio.careers,portfolio.phone,portfolio.homepage FROM users, portfolio where portfolio.id=?';
    conn.query(sql, [id],function(err,portfolio,fields){
        if(err) {
            console.log(err);
        }else{
            conn.query('SELECT users.id, users.profileImg, users.displayName FROM users where users.id=?', [id],function(err,dname,fields){
                let data = {users:req.user, portfolio:portfolio[0], dname:dname[0].displayName};
                if(portfolio[0] && req.user && req.user.displayName) { //포트폴리오 있을때
                    if (portfolio[0].temp == 1){
                         res.render('ejs/temp1.ejs', data);
                    } else if (portfolio[0].temp == 2) {
                         res.render('ejs/temp2.ejs', data);
                    } else if (portfolio[0].temp == 3) {
                        res.render('ejs/temp3.ejs', data);
                    } else if (portfolio[0].temp == 0) { 
                        res.render('ejs/portfolio.ejs', data);
                    } 
                } else if (req.user && req.user.displayName){ //로그인은했지만 포트폴리오 없을때
                    res.render('ejs/portfolio.ejs', data);
                } else if (portfolio[0]){
                    if (portfolio[0].temp == 1) {
                        res.render('ejs/temp1.ejs', data);
                    } else if (portfolio[0].temp == 2) {
                        res.render('ejs/temp2.ejs', data);
                    } else if (portfolio[0].temp == 3) {
                        res.render('ejs/temp3.ejs', data);
                    } else if (portfolio[0].temp == 0) { 
                        res.render('ejs/portfolio.ejs', data);
                    } 
                } else { //로그인도 안하고 포트폴리오도 없을경우
                    res.render('ejs/watchportfolio.ejs', {portfolio:portfolio[0]});
                }
            });  
        }
        });
    });


route.get(['/:id/edit'], function(req,res) {
    
    // console.log('Cookies: ', req.cookies);
    // res.cookie('maxAgeCookie', req.body, {
    //     maxAge: 5000
    //   })
    req.body.cookies;
    var id = req.params.id;
    var sql = 'SELECT id, email, displayName, profileImg FROM users where users.id = ?';
    conn.query(sql,[id], function(err, portfolio, fields){
        if(err) {
            console.log(err);
        }else{
            res.render('ejs/portfolio_edit.ejs', {users:req.user,portfolio:portfolio});
        }
        
    });
});

route.post('/:id/edit', function (req, res) {
    
    var id = req.params.id;
    let userData = req.body;

    conn.query(`INSERT INTO portfolio SET ?  ON DUPLICATE  KEY UPDATE temp=?, introduce=?,skills=?,careers=?, phone=?,homepage=? `,[userData,userData.temp,userData.introduce,userData.skills,userData.careers,userData.phone,userData.homepage], 
    function (err, result) {
            if (err)  {throw err;
                console.log(err);
                
            }else{
                res.status(200).send("OK");
                
            }
        }
    );
    
});


route.get(['/:id/temp0'], function(req,res) {
    var id = req.params.id;
    var sql = 'SELECT users.id, users.profileImg, portfolio.id, portfolio.introduce,portfolio.skills,portfolio.careers,portfolio.phone,portfolio.homepage FROM users, portfolio where portfolio.id=?';
    conn.query(sql, [id],function(err,portfolio,fields){
        if(err) { console.log(err);}
        else{
            conn.query('SELECT users.displayName FROM users where users.id=?', [id],function(err,dname,fields){
                if(req.user && req.user.displayName) {
                    res.render('ejs/portfolio.ejs', {users:req.user, portfolio:portfolio[0], dname:dname[0].displayName});
                } else{
                    res.render('ejs/watchportfolio.ejs', {portfolio:portfolio[0],dname:dname[0].displayName});
                }
            });}
        });
    });

route.get(['/:id/temp1'], function(req,res) {
    var id = req.params.id;
    var sql = 'SELECT users.id, users.profileImg, portfolio.id, portfolio.introduce,portfolio.skills,portfolio.careers,portfolio.phone,portfolio.homepage FROM users, portfolio where portfolio.id=?';
    conn.query(sql, [id],function(err,portfolio,fields){
        if(err) { console.log(err);}
        else{
            conn.query('SELECT users.displayName FROM users where users.id=?', [id],function(err,dname,fields){
                if(req.user && req.user.displayName) {
                    res.render('ejs/temp1.ejs', {users:req.user, portfolio:portfolio[0], dname:dname[0].displayName});
                } else{
                    res.render('ejs/watchportfolio.ejs', {portfolio:portfolio[0],dname:dname[0].displayName});
                }
            });}
        });
    });

route.get(['/:id/temp2'], function(req,res) {
    var id = req.params.id;
    var sql = 'SELECT users.id, users.profileImg, portfolio.id, portfolio.introduce,portfolio.skills,portfolio.careers,portfolio.phone,portfolio.homepage FROM users, portfolio where portfolio.id=?';
    conn.query(sql, [id],function(err,portfolio,fields){
        if(err) {
            console.log(err);
        }else{
            conn.query('SELECT users.displayName FROM users where users.id=?', [id],function(err,dname,fields){
                if(req.user && req.user.displayName) {
                    res.render('ejs/temp2.ejs', {users:req.user, portfolio:portfolio[0], dname:dname[0].displayName});
                } else{
                    res.render('ejs/watchportfolio.ejs', {portfolio:portfolio[0],dname:dname[0].displayName});
                }
            });    
        }
    });
});

route.get(['/:id/temp3'], function(req,res) {
    var id = req.params.id;
    let thema = req.params.thema;
    var sql = 'SELECT users.id, users.profileImg, portfolio.id, portfolio.introduce,portfolio.skills,portfolio.careers,portfolio.phone,portfolio.homepage FROM users, portfolio where portfolio.id=?';
    conn.query(sql, [id],function(err,portfolio,fields){
        if(err) {
            console.log(err);
        }else{
            conn.query('SELECT users.displayName FROM users where users.id=?', [id],function(err,dname,fields){
                if(req.user && req.user.displayName) {
                    res.render(`ejs/temp3.ejs`, {users:req.user, portfolio:portfolio[0], dname:dname[0].displayName});
                } else{
                    res.render('ejs/watchportfolio.ejs', {portfolio:portfolio[0],dname:dname[0].displayName});
                }
            });    
        }
    });
});
route.get('/:id/download', function (req, res) {
    
    var id = req.params.id;
    var name;
    var sql = 'SELECT users.id, users.profileImg, portfolio.id, portfolio.temp, portfolio.introduce,portfolio.skills,portfolio.careers,portfolio.phone,portfolio.homepage FROM users, portfolio where portfolio.id=?';
    conn.query(sql, [id],function(err,portfolio,fields){
        conn.query('SELECT users.displayName FROM users where users.id=?', [id],function(err,dname,fields){  
        if(portfolio[0].temp == 0){
            ejs.renderFile('view/ejs/portfolio.ejs', {users:req.user, portfolio:portfolio[0], dname:dname[0].displayName}, function(err, result) {
                if (result) { html = result; }
                else { 
                    res.end('An error occurred'); 
                    console.log(err);
                }
            });        
        } else if (portfolio[0].temp == 1){
            ejs.renderFile('view/ejs/temp1.ejs', {users:req.user, portfolio:portfolio[0], dname:dname[0].displayName}, function(err, result) {
                if (result) { html = result; }
                else { 
                    res.end('An error occurred'); 
                    console.log(err);
                }
            });                          
        } else if(portfolio[0].temp == 2){
                ejs.renderFile('view/ejs/temp2.ejs', {users:req.user, portfolio:portfolio[0], dname:dname[0].displayName}, function(err, result) {
                if (result) { html = result; }
                else { 
                    res.end('An error occurred'); 
                    console.log(err);
                }
            });     
        } else if(portfolio[0].temp == 3){
                ejs.renderFile('view/ejs/temp3.ejs', {users:req.user, portfolio:portfolio[0], dname:dname[0].displayName}, function(err, result) {
                if (result) { html = result; }
                else { 
                    res.end('An error occurred'); 
                    console.log(err);
                }
            });     
        } 

        let filepath = 'uploads/pdf';
        var options = { filename: 'uploads/pdf/portfolio.pdf', format: 'A4', orientation: 'portrait', type: "pdf"};
        pdf.create(html, options).toFile(function(err, response) {
            if (err) return console.log(err);
            console.log(response);
            console.log("PDF file successfully written");
            filepath += '/portfolio.pdf';
            res.download(filepath);        
        });
        });
    });
});



route.get('/:id/source', function (req, res) {
    
    var id = req.params.id;
    var url = "http://localhost:7777/portfolio/"+id;
    request(url, function(error, response, html){
        console.log("소스코드 보기 성공");
        res.writeHead(200,{'Content-Type':'text/plain; charset=UTF-8'});
        res.write(html);
        res.end();
    });
    
    
});

route.get('/:id/sourcedownload', function (req, res) {
    let id = req.params.id;
    scrape({
        urls: [{url: 'http://localhost:7777/portfolio/'+id, filename: 'portfolio.html'}],
        directory: 'uploads/source/'+id, encoding: 'utf-8'
    }).then(console.log).catch(console.log).done(function(){
    
    var zip5 = new EasyZip();
    zip5.zipFolder('uploads/source/',function(){
        zip5.writeToResponse(res,'portfolio')
    });
 });
});


module.exports = route;