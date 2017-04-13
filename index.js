  var express = require('express');
  var exphbs = require('express-handlebars');
  var app = express();

  app.use(express.static('public'));
  app.use('/components', express.static('bower_components'));

  app.engine('hbs', exphbs({
      extname: '.hbs',
      defaultLayout: 'application'
  }));
  app.set('view engine', 'hbs');

  app.get('/', function(req, res) {
      res.render('index', {
          title: ' Hey HomePage',
          message: 'My HomePage',
      });
  });

  app.get('/albums', function(req, res) {
      var images = [
          'image/image1.jpg',
          'image/image2.jpg'
      ];
      res.render('albums', {
          tilte: 'Hey Albums',
          message: 'My Albums',
          images: images
      });
  });

  app.get('/photos', function(req, res) {
      var images = [{
              image: 'image/image3.jpg',
              view: 1
          },
          {
              image: 'image/image4.jpg',
              view: 2
          },
          {
              image: 'image/image5.jpg',
              view: 3
          }
      ];
      res.render('photos', {
          title: 'My Photo',
          message: 'My Photo',
          images: images
      });
  });

  app.get('/blogs', function(req, res) {
      var blogs = [{
              title: 'blog1',
              user: 'user 1',
              image: 'image/image1.jpg',
              view: 2,
              detail: 'detail'
          }

      ];
      res.render('blogs', {
          title: 'My Blog',
          message: 'My Blog',
          blogs: blogs
      });
  });

  app.get('/blogdetail', function(req, res) {
      var blog = [{
          user: 'user',
          image: 'image/image1.jpg',
          title: 'title',
          detail: 'detail',
          view: 3
      }];
      res.render('blogdetail', {
          title: 'Blog Detail',
          message: 'Blog Detail',
          blog: blog
      });
  });

  app.listen(3000, function() {
      console.log('Example app listening on port 3000!');
  });
