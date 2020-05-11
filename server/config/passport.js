const configs = require('../config/config.js');
const instagramConfig = configs.instagramConfig;
const googleConfig = configs.googleConfig;
const kakaoConfig = configs.kakaoConfig;
const facebookConfig = configs.facebookConfig;

module.exports = function(app){
    var conn = require('../database/db');
    var bkfd2Password = require("pbkdf2-password");
    var hasher = bkfd2Password();
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var KakaoStrategy = require('passport-kakao').Strategy;
    var InstagramStrategy = require('passport-instagram').Strategy;
    var GoogleStrategy = require('passport-google-oauth2').Strategy;

    //passport 초기화하고 사용 셋팅
    app.use(passport.initialize());
    //passport를 이용해서 인증시 세션사용
    app.use(passport.session());

    //passport 세션관리 코드
    //passport.use()라우터에서 done(null, user)에서의 user인자가 이리로 넘어옴
    //done함수에 의해 세션에 authId가 저장됨
    passport.serializeUser(function(user, done) {
      console.log('serializeUser', user);
      done(null, user.authId);
    });

    //위의 user.authId값이 id로 들어와서 사용자 확인
    //id값으로 db에서 사용자 조회
    passport.deserializeUser(function(id, done) {
      console.log('deserializeUser', id);
      var sql = 'SELECT * FROM users WHERE authId=?';
      conn.query(sql, [id], function(err, results){
          if(err){
              console.log(err);
              done('There is no user.');
        } else {
            done(null, results[0]);
        }
    });
    });
    
    //콜백함수 인자 3개는 입력값을 결합해서 사용자의 로그인 여부를 판단
    passport.use(new LocalStrategy(
      function(username, password, done){
        var uname = username;
        var pwd = password;

        var sql = 'SELECT * FROM users WHERE authId=?';
        conn.query(sql, ['local@'+uname], function(err, results){ 
             if(err){ 
                  return done('There is no user.'); 
             }
         var user = results[0];  
         //hasher를 통해 해쉬값을 만든다.
         return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
             if(hash === user.password){
                 console.log('LocalStrategy', user);
                 done(null, user); 
             } else{
                 done(null, false); 
             }
         });
        });
      }
    ));

    passport.use(new FacebookStrategy(facebookConfig,
      function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        //profile의 id는 페북 식별자임 + 페북인증 문구를 넣어서 식별
        var authId = 'facebook@' + profile.id;
        var sql = 'SELECT * FROM users WHERE authId=?';
        conn.query(sql, [authId], function(err, results){
            if(results.length>0){ //사용자가 존재한다면
               done(null, results[0]);
            } else { //사용자가 없다면 새로운 사용자로 추가한다.
                var newuser = {
                   'authId':authId,
                    'displayName':profile.displayName,
                    'email':profile.emails[0].value //email이 여러개인 경우 중 맨 첫번째 이메일을 갖다쓰겠다.
                };
                var sql = 'INSERT INTO users SET ?'
                conn.query(sql, newuser, function(err, results){
                    if(err){
                        console.log(err);
                        done('Error');
                    } else{
                        done(null, newuser);
                    }
                })
            } 
        });
      }
    ));
    
    passport.use(new KakaoStrategy(kakaoConfig,
      function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        var authId = 'kakao@' + profile.id;
        var sql = 'SELECT * FROM users WHERE authId=?';
        conn.query(sql, [authId], function(err, results){
            if(results.length>0){ 
               done(null, results[0]);
            } else { 
                var newuser = {
                   'authId':authId,
                    'displayName':profile.displayName,
                    'email': profile._json.kaccount_email
                };
                var sql = 'INSERT INTO users SET ?'
                conn.query(sql, newuser, function(err, results){
                    if(err){
                        console.log(err);
                        done('Error');
                    } else{
                        done(null, newuser);
                    }
                })
            } 
        });
      }
    ));
    
    //구글 로그인
    passport.use(new GoogleStrategy(googleConfig,
      function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        var authId = 'google@' + profile.id;
        var sql = 'SELECT * FROM users WHERE authId=?';
        conn.query(sql, [authId], function(err, results){
            if(results.length>0){ 
               done(null, results[0]);
            } else { 
                var newuser = {
                   'authId':authId,
                    'displayName':profile.displayName,
                    'email': profile._json.email
                };
                var sql = 'INSERT INTO users SET ?'
                conn.query(sql, newuser, function(err, results){
                    if(err){
                        console.log(err);
                        done('Error');
                    } else{
                        done(null, newuser);
                    }
                })
            } 
        });
      }
    ));
    
    //인스타그램 로그인
    passport.use(new InstagramStrategy(instagramConfig,
      function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        var authId = 'instagram@' + profile.id;
        var sql = 'SELECT * FROM users WHERE authId=?';
        conn.query(sql, [authId], function(err, results){
            if(results.length>0){ 
               done(null, results[0]);
            } else { 
                var newuser = {
                   'authId':authId,
                    'displayName':profile.username,
                    'email': profile._json.email
                };
                var sql = 'INSERT INTO users SET ?'
                conn.query(sql, newuser, function(err, results){
                    if(err){
                        console.log(err);
                        done('Error');
                    } else{
                        done(null, newuser);
                    }
                })
            } 
        });
      }
    ));
    
    return passport;
}