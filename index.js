  var express = require('express');
  var exphbs  = require('express-handlebars');
  var app = express();

  app.use(express.static('public'));
  app.use('/components', express.static('bower_components'));

  app.engine('hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'application'
  }));
  app.set('view engine', 'hbs');

  app.get('/', function (req, res) {
    res.render('index', {
      title: ' Hey HomePage',
      message: 'My HomePage',
   });
  });

  app.get('/albums', function (req, res) {
    var images = [
      'image/image1.jpg',
      'image/image2.jpg',
    ];
    res.render('albums', {
      tilte: 'Hey Albums',
      message: 'My Albums',
      images: images,
      layout: 'application'
    });
  });

  app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  });
