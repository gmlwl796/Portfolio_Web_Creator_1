const comment = require('./comment');
const file = require('./file');
const portfolio = require('./portfolio');

module.exports = function (server) {
    const passport = require('../config/passport')(server);
    const auth = require('./auth')(passport);

    server.use('/comment', comment);
    server.use('/upload', file);
    server.use('/portfolio/', portfolio);
    server.get('/test', (request, response) => {
        response.sendFile('view/html/portfolio.html', {root: __dirname + '/../../' });
    });

    server.use('/auth/', auth);
    server.get('/count', function (req, res){
        if(req.session.count) {
            req.session.count++;
        } else {
            req.session.count = 1;
        }
        res.send('count : '+req.session.count);
    });
    
    //deserializeUser에서의 done(null, user)에서 user의 값이 있는지 확인해서 username 뿌려줌
    server.get(['/','/main'], function (req, res){
        res.redirect('/portfolio'); 
    });
    
}