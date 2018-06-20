# Devotion-blog
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var logger = require('morgan');
var expressValidator = require('express-validator');
var bodyParser = require('body-Parser');
var mongo = require('mongodb');
var db = require("monk")('localhost/dailyblog');
var flash = require('connect-flash');

var multer = require('multer');
var uploads = multer({dest: './uploads'});


var indexRouter = require('./routes/index');
var posts = require('./routes/posts');
var categories = require('./routes/categories');


var app = express();


app.locals.moment = require('moment');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// handle file Upload and Multipart Data


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Express session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

//Express Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
      var namespace = param.split('.')
          , root = namespace.shift()
          , formParam = root;
     while (namespace.length) {
       formParam += '[' + namespace.shift() + ']';

     }
     return{
       param : formParam,
       msg   : msg,
       value : value
     };

  }
}));
app.use(express.static(path.join(__dirname, 'public')));

//connect-Flash
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req,res);
  next();
    
});

  // Make our db accessible to our router
app.use(function (req,res,next) {
  req.db = db;
  next();

});



app.use('/', indexRouter);
app.use('/posts', posts);
app.use('/categories', categories);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
