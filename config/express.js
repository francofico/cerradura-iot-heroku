'use strict';

var logger = require('morgan');
var bodyParser = require('body-parser');
var compress = require('compression');

module.exports = function(app, io, config) {
  config.configureLocalEnv(app);
  config.configureViewEngine(app);

  //TODO: Mirar porque tiene un dev esto.
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(compress());
  
  config.staticFiles(app);

  var Stove = require('../app/models/Stove');
  var stove = new Stove();

  io.on('connection', function connectSocket(socket) {
    socket.emit('status', stove);
  });

  stove.on('status', function onStoveStatus(stove) {
    io.emit('status', stove);
  });

  stove.on('toggleOnOff', function onStoveToggleOnOff(isOn) {
    io.emit('toggleOnOff', isOn);
  });

  var routes = require(config.root + '/app/routes')(stove);
  routes.forEach(function (route) {
    app.use(route);
  });

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  if(config.isDevelopment) {
    app.use(function (err, req, res) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
      title: 'error'
    });
  });
};