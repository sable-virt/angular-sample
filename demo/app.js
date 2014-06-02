/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var socket = require('./sockets/socket');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 8000);
    app.set('views', __dirname + '/views');
    //app.set('view engine', 'jade');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());

    //CSRF対策
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'secret goes here' }));
    app.use(express.csrf());

    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

});

app.configure('development', function () {
    app.use(express.errorHandler());
});

function csrf(req, res, next) {
    res.cookie('XSRF-TOKEN', req.session._csrf, {httpOnly: false });
    if (next) {
        next();
    }
}

app.get('/', routes.index);
app.get('/form', routes.form);
app.get('/filter', routes.filter);
app.get('/csrf',csrf, routes.csrf);
app.get('/token', routes.token);

var server = http.createServer(app);

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
    // socket.ioのコネクション設定
    socket.init(server);
});

