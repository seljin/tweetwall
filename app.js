var api = require('./api/');
var express = require('express');
var path = require('path');

var app = express();
var port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static('public'));

// app.use('/api', api);
app.get('*', function(req, res) {
  res.render('index');
});

app.listen(port);
console.log('Welcome to twitwall !\nPlease go to http://localhost:' + port + ' to start.');
