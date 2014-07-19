var api = require('./api/');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var sass = require('node-sass');

var util = require('util');

var app = express();
var port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(session({
  secret: '206705567395tweet',
  saveUninitialized: true,
  resave: true
}));
app.use(sass.middleware({
    src: path.join(__dirname, 'sassheets/'),
    dest: path.join(__dirname, 'public/'),
    debug: true
}));

app.get('/login', function(req, res){
  if (req.query.oauth_token && req.query.oauth_verifier && req.session.oauth) {
    api.getAccessToken(req.session.oauth.token, req.session.oauth.tokenSecret, req.query.oauth_verifier,
      function(error, accessToken, accessTokenSecret, results) {
        if (error) {
            console.log('Error getting access tokens : ', util.inspect(error));
            res.send(500, 'Something went wrong while getting access tokens');
        } else {
          req.session.twitTokens = {
            accessToken: accessToken,
            accessTokenSecret: accessTokenSecret
          };          
          //Verify Credentials belongs here
          res.redirect('/');
        }
    });
  }
  else {
    api.getRequestToken(function(error, requestToken, requestTokenSecret, results){
      if (error) {
        console.log('Error getting OAuth request tokens : ', util.inspect(error));
        res.send(500, 'Error with OAuth');
      } else {
        req.session.oauth = {
          token: requestToken,
          tokenSecret: requestTokenSecret
        };
        res.redirect('https://twitter.com/oauth/authenticate?oauth_token=' + requestToken);
      }
    });
  }
});

app.post('/tweet', function(req, res) {
  var tokens = req.session.twitTokens;
  if (!tokens)
    res.send(500, 'you need to log in with twitter');
  else {
    api.statuses('update', {status: req.body.tweet},
      tokens.accessToken,
      tokens.accessTokenSecret,
      function(error, data, response) {
        if (error){
          console.log(util.inspect(error));
          res.send(500, 'Something went wrong while tweet attempt');
        } else {
          res.send('ok');
        }
    });
  }
});

app.get('/', function(req, res) {  
  res.render('index', {authed: (req.session.twitTokens ? true : false)});
});

app.listen(port);
console.log('Welcome to twitwall !\nPlease go to http://localhost:' + port + ' to start.');
