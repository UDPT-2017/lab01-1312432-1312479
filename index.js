  var express = require('express');
  var exphbs = require('express-handlebars');
  var app = express();
  const pool = require('./lib/db');
  //var parse = require('pg-connection-string').parse;

  //var config = parse('postgres://postgres:123456@localhost:5432/lab01');





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
      var images = [];
      pool.connect(function(err, client, done) {

          if (err) {
              console.error('error fetching client from pool', err);
          }

          //use the client for executing the query
          var sql = 'select a.id, a.title, a.userid, sum(p.view) as view ' +
                    'from albums a left join photos p on (a.id = p.albumid)' +
                    ' group by a.id';
          client.query(sql, function(err, result) {
              //call `done(err)` to release the client back to the pool (or destroy it if there is an error)
              done(err);

              if (err) {
                  console.error('error running query', err);
              }
              var length = result.rowCount;
              if (length > 0) {
                  var images = [];
                  for (var i = 0; i < result.rowCount; i++) {
                      images.push(result.rows[i]);
                  }
              }

              res.render('albums', {
                  tilte: 'Hey Albums',
                  message: 'My Albums',
                  images: images
              });
          });

      });
      /*  res.render('albums', {
            tilte: 'Hey Albums',
            message: 'My Albums',
            images: images
        });*/
  });
  app.get('/album/:id', function(req, res) {
      pool.connect(function(err, client, done) {
          if (err) {
              console.log('error');
          }
          //thuc hien query
          console.log(req.params.id);
          client.query('select * from photos where albumid = $1', [req.params.id], function(err, result) {
              done(err);
              console.log(req.params.id);
              if (err) {
                  console.log('error query');
              }
              var length = result.rowCount;
              if (length > 0) {
                  var photos = [];
                  for (var i = 0; i < length; i++) {
                      photos.push(result.rows[i]);
                  }
              }


              res.render('album_photos', {
                  tilte: 'My Album',
                  message: 'My Album',
                  images: photos
              });
          });

      });

  });

  app.get('/photo/:id', function(req, res) {

      pool.connect(function(err, client, done) {
          if (err) {
              console.log('error');
          }
          //thuc hien query update view photos
          client.query('update photos set view = view + 1 where id = $1', [req.params.id], function(err, result) {
              done(err);
              if (err) {
                console.log('error query');
              }
          });
          // thuc hien update view album_photos

          //thuc hien select photo va render
          client.query('select * from photos where id = $1', [req.params.id], function(err, result) {
              done(err);
              //console.log(req.params.id);
              if (err) {
                  console.log('error query');
              }
              var length = result.rowCount;
              if (length > 0) {
                  var photos = [];
                  for (var i = 0; i < length; i++) {
                      photos.push(result.rows[i]);
                  }
              }


              res.render('photos', {
                  tilte: 'My Photo',
                  message: 'My Photo',
                  images: photos
              });
          });

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

  app.get('/abouts', function(req, res) {

      res.render('abouts', {
          title: 'about',
          message: 'about',

      });
  });



  app.listen(3000, function() {
      console.log('Example app listening on port 3000!');
  });
