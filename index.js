var proxy = require('./proxy');
var express = require('express');
var app = express();
var port = 9000;
var ip = require('ip');

var urlsList = [];

function onIntercept(userRequest) {
  // check if URL contains a playlist link
  var url = userRequest.url;
  if (url.indexOf('.m3u8') !== -1) {
    console.log( '  > m3u8 request: %s', url );
    // check if url is already in list
    if (urlsList.indexOf(url) === -1) {
      urlsList.push(url);
    }
  }
}

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.use('/img', express.static('img'));

app.get('/data', function (req, res) {
  res.send(JSON.stringify({
    ipaddress: ip.address(),
    port: 9000,
    videos: urlsList,
  }));
});


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/frontend.html');
});

app.listen(9876, function () {
  console.log('Video snagger listening on port 9876!')
});

proxy(onIntercept, port);
