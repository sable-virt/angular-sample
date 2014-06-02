/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var socket = require('./sockets/chat');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 8000);
    app.set('views', __dirname + '/views');
    //app.set('view engine', 'jade');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/views/:name', routes.views);
app.post('/login', routes.login);
app.get('/room/:id', routes.index);

mongoose.connect('mongodb://localhost/chat');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function callback() {
    // yay!
});

var server = http.createServer(app);

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
    // socket.ioのコネクション設定
    socket.init(server);
});

