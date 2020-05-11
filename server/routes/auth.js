module.exports = function(passport) {
    //auth path
    var bkfd2Password = require("pbkdf2-password");
    var hasher = bkfd2Password();
    var conn = require('../database/db');
    var route = require('express').Router();


    //post방식으로 로그인으로 접근
    route.post(
      '/login',
      passport.authenticate(
        'local',
        {
            //로그인 성공시 main페이지로
            //로그인 실패시 다시 로그인 시도
            //로그인페이지로 보낼 때, 사용자에게 인증 실패 안내기법 failureFlash
          successRedirect: '/main',
          failureRedirect: '/auth/login',
          failureFlash: false
        }
      )
    );

    //페이스북으로 로그인 get방식으로 들어와도 상관없음
    //페이스북은 라우터가 2개여야함.
    route.get(
      '/facebook',
      passport.authenticate(
        'facebook',
        {scope:'email'}
      )
    );
    route.get(
      '/facebook/callback',
      passport.authenticate(
        'facebook',
        {
          successRedirect: '/main',
          failureRedirect: '/auth/login'
        }
      )
    );
    
    //카카오톡
    route.get(
      '/kakao',
      passport.authenticate('kakao',
        {scope:'account_email'}
    )
    );
    route.get(
      '/kakao/callback',
      passport.authenticate(
        'kakao',
        {
          successRedirect: '/main',
          failureRedirect: '/auth/login'
        }
      )
    );

    //구글
     route.get(
      '/google',
      passport.authenticate(
        'google',
        {scope:['openid', 'email']}
      )
    );
    route.get(
      '/google/callback',
      passport.authenticate(
        'google',
        {
          successRedirect: '/main',
          failureRedirect: '/auth/login'
        }
      )
    );
    
    
    //인스타그램
     route.get(
      '/instagram',
      passport.authenticate(
        'instagram'
      )
    );
    route.get(
      '/instagram/callback',
      passport.authenticate(
        'instagram',
        {
          successRedirect: '/main',
          failureRedirect: '/auth/login'
        }
      )
    );
    
    route.post('/register', function(req, res){//pwd hash로 암호화해서 salt만들어냄
      hasher({password:req.body.password}, function(err, pass, salt, hash){
        var user = {
          authId:'local@'+req.body.username,
          username:req.body.username,
          password:hash,
          salt:salt,
          displayName:req.body.displayName
        };
        var sql = 'INSERT INTO users SET ?';
        conn.query(sql, user, function(err, results){
            if(err){
                console.log(err); 
                res.status(500); 
            } else {
                //register후 바로 로그인되도록~!
                req.login(user, function(err){
                    req.session.save(function(){
                        res.redirect('/main');
                    });
                });
            }
        });
      });
    });

    route.get('/register', function(req, res){
      res.render('auth/register.ejs');
    });

    route.get('/login', function(req, res){
      res.render('auth/login.ejs'); 
    });
    
    //logout메소드를 이용해서 로그아웃사용~
    route.get('/logout', function(req, res){
      req.logout();
     //로그아웃 후 메인으로 리다이렉션
      req.session.save(function(){
        res.redirect('/main');
      });
    });
    
    
    route.get(['/mypage/:id'], function(req,res){
        var id = req.params.id;
        var sql = 'SELECT id, email, displayName, profileImg FROM users where id = ?';
        var sql2 = 'SELECT portfolio.id, portfolio.temp FROM users, portfolio where portfolio.id = users.id and portfolio.pid=?';
        conn.query(sql, [id], function(err,users,fields){
            if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            conn.query(sql2, [id], function(err,portfolio,fields){
                if(portfolio[0])
                    res.render('ejs/mypage.ejs', {users:users[0], portfolio:portfolio[0]});
                else
                    res.render('ejs/mypage.ejs', {users:users[0], portfolio:portfolio[0]});
            });
          }
        });
        
    });
    
    route.get(['/mypage/:id/edit'], function(req,res){
        var id = req.params.id;
        var sql = 'SELECT id, email, displayName, profileImg FROM users where id = ?';
        conn.query(sql, [id], function(err,users,fields){
            if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            res.render('ejs/mypage_edit.ejs', {users:users[0]});
          }
        });
    });
    
    route.post('/mypage/:id/edit', function(req, res){
        var id = req.params.id;
        var displayName = req.body.displayName;
        var email = req.body.email;
        
        var sql = 'UPDATE users SET displayName=?, email=? WHERE id=?';
        conn.query(sql, [displayName, email, id], function(err, users, fields){
            if(err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else {
                res.redirect('/auth/mypage/'+id) // 수정한 페이지로 이동
            }
        });
    });
    
    
    
    return route;
};