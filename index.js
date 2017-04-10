var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();

app.use(express.static('public'));
app.use('/components', express.static('bower_components'));

app.engine('hbs', exphbs({}));
app.set('view engine', 'hbs');

app.get('/hbs', function (req, res) {
   res.render('index', { title: ' Hey HomePage', message: 'Hello there!' });
});

app.get('/albums', function (req, res) {
    var images = [
      'image/image1.jpg',
      'image/image2.jpg',
    ];
    res.render('albums', {tilte: 'Hey Albums', message: 'My Albums',images: images});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
