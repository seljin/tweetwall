var io = require('socket.io')(8000);
var express = require('express');
var app = express();
var Twit = require('node-tweet-stream');

var stream = new Twit({
    consumer_key:         '',
    consumer_secret:      '',
    token:         '',
    token_secret:  ''
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

var tracked = {};

processTweet = function(tweet) {
    hashtags = tweet.entities.hashtags;
    for (var i = 0; i < hashtags.length; i++){
        var text = hashtags[i].text.toLowerCase();
        if (tracked[text]){
            var s = tracked[text];
            if(s) s.emit('tweet', tweet);
            console.log('yes');
        }
    }
}

stream.on('tweet', function (tweet) {
    var msg = {
        text: tweet.text,
        user: {
            name: tweet.user.name,
            image: tweet.user.profile_image_url
        }
    };
 
    console.log('tweet');
    processTweet(tweet);
    //io.emit('tweet', tweet);
});

io.on('connection', function(socket){
    socket.on('disconnect', function() {
        console.log('\n\nclient disconnected\n\n');
    });
});

app.get('/:hashtag', function(req, res) {
    hashtag = req.param('hashtag');
    if(!hashtag) res.end('Hashtag needed');
    if(tracked[hashtag]) res.end('already tracked');

    var s = io.of('/' + hashtag);

    tracked[hashtag] = s;
    // =====TODO count clients to stop tracking when no more clients ==============================
    s.on('connection', function(socket){
        console.log('connection');
        socket.on('disconnect', function(){
            console.log('disconnected!!');
            // stream.untrack('#' + hashtag);
            // delete tracked[hashtag.toLowerCase()];
        });
    });
    // ====================== TODO ==============================
    
    stream.track('#' + hashtag);
    res.end('#' + hashtag);
});

module.exports = app;
