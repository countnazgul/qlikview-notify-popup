var config = require('./config');
var async = require('async');
var swig = require('swig');
var cons = require('consolidate');
var fs = require('fs');
var Datastore = require('nedb');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.use(bodyParser.json());
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.use(morgan('tiny'));

var notifydb = new Datastore({
    filename: 'data/notify.db',
    autoload: true
});

notifydb.loadDatabase(function(err) {
    console.log('"notify" db is loaded');
});


app.listen(config.main.port, function() {
    console.log('Server is listening on port ' + config.main.port + '!');
});

app.get('/', function(req, res) {
    notifydb.find({}, function(err, docs) {
        res.render('index', { notifications: docs });
    });
});


app.post('/add', function(req, res) {
    var data = req.body;
    notifydb.insert({
        document: data.document,
        description: data.description,
        valid: data.valid,
        validTo: data.validTo
    }, function(err, newNotification) {
        res.send(newNotification)
    })
});

app.post('/delete', function(req, res) {
    var data = req.body;
    res.send({removed: 1});
    //notifydb.remove({ _id: data.id }, {}, function (err, numRemoved) {
    //    res.send(numRemoved);
    //});    
});