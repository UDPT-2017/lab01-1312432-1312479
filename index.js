  var express = require('express');
  var exphbs = require('express-handlebars');
  var app = express();
  const pool = require('./lib/db');
  var bodyParser = require('body-parser');
  var session = require('express-session');




  app.use(session({
      secret: '123',
  }));
  app.use(bodyParser.urlencoded({
      extended: true
  }));
  app.use(express.static('public'));
  app.use('/components', express.static('bower_components'));

  app.engine('hbs', exphbs({
      extname: '.hbs',
      defaultLayout: 'application'
  }));
  app.set('view engine', 'hbs');

  app.get('/', function(req, res) {
      //console.log(req.session.get('id'));
      res.render('index', {
          title: ' Hey HomePage',
          message: 'My HomePage',
      });
  });

  app.get('/albums', function(req, res) {
      console.log(req.session.iduserlogin);
      var images = [];
      if (req.session.iduserlogin != null) {
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
                  var images = [];
                  if (length > 0) {

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

      } else {
          res.redirect('/dangnhap');
      }

  });

  app.get('/album/:id', function(req, res) {

      if (req.session.iduserlogin != null) {
          pool.connect(function(err, client, done) {
              if (err) {
                  console.log('error');
              }
              //thuc hien query
              //  console.log(req.params.get());
              client.query('select * from photos where albumid = $1', [req.params.id], function(err, result) {
                  done(err);
                  console.log(req.params.id);
                  if (err) {
                      console.log('error query');
                  }
                  var length = result.rowCount;
                  var photos = [];
                  if (length > 0) {

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
      } else {
          res.redirect('/dangnhap');
      }
  });

  app.get('/photo/:id', function(req, res) {
      if (req.session.iduserlogin != null) {
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
                  var photos = [];
                  if (length > 0) {
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
      } else {
          res.redirect('/dangnhap');
      }
  });

  app.get('/blogs', function(req, res) {
      if (req.session.iduserlogin != null) {
          pool.connect(function(err, client, done) {
              if (err) {
                  console.log('error');
              }
              //thuc hien query

              client.query('select b.id, b.title, b.view, u.avatar, u.username from blogs b left join users u on (b.userid = u.id)', function(err, result) {
                  done(err);
                  console.log(req.params.id);
                  if (err) {
                      console.log('error query');
                  }
                  var length = result.rowCount;
                  var blogs = [];
                  if (length > 0) {

                      for (var i = 0; i < length; i++) {
                          blogs.push(result.rows[i]);
                      }
                  }


                  res.render('blogs', {
                      tilte: 'My Album',
                      message: 'My Album',
                      images: blogs
                  });
              });
          });
      } else {
          res.redirect('/dangnhap');
      }
  });

  app.get('/blog/:id', function(req, res) {
      if (req.session.iduserlogin != null) {
          pool.connect(function(err, client, done) {
              if (err) {
                  console.log('error');
              }
              //thuc hien query update

              client.query('update blogs set view = view + 1 where id = $1', [req.params.id], function(err, result) {
                  done(err);
                  if (err) {
                      console.log('error');
                  }
              });
              //thuc hien select blogs
              client.query('select b.id, b.title, b.blogdetail, u.avatar, u.username from blogs b,users u where b.id = $1 and b.userid = u.id', [req.params.id], function(err, result) {
                  done(err);
                  if (err) {
                      console.log('error query');
                  }
                  var length = result.rowCount;
                  var blog = [];
                  if (length > 0) {

                      for (var i = 0; i < length; i++) {
                          blog.push(result.rows[i]);
                      }
                  }


                  res.render('blogdetail', {
                      tilte: 'My Blog',
                      message: 'My Blog',
                      images: blog,

                  });
              });
          });
      } else {
          res.redirect('/dangnhap');
      }
  });

  app.get('/abouts', function(req, res) {

      res.render('abouts', {
          title: 'about',
          message: 'about',
      });
  });

  app.get('/dangky', function(req, res) {
      res.render('dangky', {
          title: 'dang ky',
          message: 'dang ky',
      });
  });

  app.post('/dangky', function(req, res) {
      pool.connect(function(err, client, done) {
          if (err) {
              console.log('error');
          }
          //kiem tra user name da ton tai trong db chua
          client.query('select id from users where username = $1', [req.body.username], function(err, result) {
              done(err);
              if (err) {
                  console.log('error query');
              }

              if (result.rowCount == 1) {
                  //USER da co trong db
                  res.redirect('/dangky');
              } else {
                  //insert user vao db
                  client.query('insert into users(username, password, email, avatar) values($1, $2, $3, $4)', [req.body.username, req.body.password, req.body.email, req.body.avatar], function(err, result) {
                      done(err);
                      if (err) {
                          console.log('error query');
                      }
                      console.log(req.body);
                      res.redirect('/dangnhap');
                  });

              }


          });
      });

  });

  app.get('/dangnhap', function(req, res) {
      res.render('dangnhap', {
          title: 'dang nhap',
          message: 'dang nhap',
      });
  });

  app.post('/dangnhap', function(req, res) {
      pool.connect(function(err, client, done) {
          if (err) {
              console.log('error');
          }
          console.log(req.body);
          client.query('select id from users where username = $1 and password = $2', [req.body.username, req.body.password], function(err, result) {
              done(err);
              if (err) {
                  console.log('error query');
              }
              if (result.rowCount == 1) {
                  req.session.iduserlogin = result.rows[0].id;
                  res.redirect('/');
              } else {
                  res.render('dangnhap', {
                      title: 'dang nhap',
                      message: 'dang nhap',
                  });
              }
          });
      })
  });

  app.get('/thoat', function(req, res) {
      req.session.iduserlogin = null;
      console.log(req.session);
      console.log(req.session.userid);
      res.redirect('/dangnhap');
  });

  app.listen(3000, function() {
      console.log('Example app listening on port 3000!');
  });
