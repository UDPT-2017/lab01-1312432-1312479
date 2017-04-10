var express = require('express');
var app = express();

app.use(express.static('public'));
app.use('/components', express.static('bower_components'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});