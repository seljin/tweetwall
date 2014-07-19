var Twit = require('node-tweet-stream');
var TwitterApi = require('node-twitter-api');
var io = require('socket.io')(8000);

var stream = new Twit({
    consumer_key:         '',
    consumer_secret:      '',
    token:         '',
    token_secret:  ''
});

var twitter = new TwitterApi({
    consumerKey:            '',
    consumerSecret:        '',
    callback:               'http://localhost:3000/login'
});

stream.on('connect', function(request) {
    console.log('connecting to twitter api');
});

stream.on('connected', function (response) {
    console.log('Connected to Twitter API');
});

stream.on('disconnect', function(message) {
    console.log('Disconnected from Twitter API. Message: ' + message);
});

stream.on('reconnect', function (request, response, connectInterval) {
    console.log('Trying to reconnect to Twitter API in ' + connectInterval + ' ms');
});

stream.on('error', function (err) {
    console.log('error : ', err);
});

//todo remove hashtable not usefull anymore : use array
var tracked = {};

stream.on('tweet', function (tweet) {
    hashtags = tweet.entities.hashtags;
    for (var i = 0; i < hashtags.length; i++){
        var text = hashtags[i].text.toLowerCase();

        if (tracked[text])
            io.to(text).emit('tweet', tweet);
    }
});

// =====TODO count clients to stop tracking and emit when no more clients ==============================
// ====================== TODO ============================== 
io.on('connection', function(socket){
    console.log('connected');

    socket.on('disconnect', function() {
        console.log('client disconnected');
    });

    socket.on('track', function(hash) {
        console.log('client tracking ', hash);

        socket.join(hash);
        tracked[hash] = true;
        stream.track('#' + hash);
    });

    socket.on('untrack', function(hash) {
        console.log('client utracking ', hash);

        socket.leave(hash);
    });
});

module.exports = twitter;
