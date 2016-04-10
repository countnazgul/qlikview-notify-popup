var config = require('./config');
var async = require('async');
var swig = require('swig');
var cons = require('consolidate');
//var fs = require('fs');
var moment = require('moment');
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

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var notifydb = new Datastore({
    filename: 'data/notify.db',
    autoload: true
});

notifydb.loadDatabase(function(err) {
    console.log('"notify" db is loaded');
});

app.get('/', function(req, res) {
    notifydb.find({}, function(err, docs) {
        res.render('index', {
            notifications: docs
        });
    });
});

app.get('/test', function(req, res) {
    res.render('test', { });
});

app.get('/details/:id', function(req, res) {
    notifydb.findOne({
        _id: req.params.id
    }, function(err, doc) {
        doc.document = doc.document.split(';');
        res.render('notification', {
            notification: doc
        });
    });
});

app.get('/notifications/:document', function(req, res) {
    notifydb.find({}, function(err, docs) {
        var notifications = [];
        async.each(docs, function(doc, callback) {

            if (doc.document.toLowerCase().indexOf(req.params.document.toLowerCase()) > -1) {                
                if (doc.valid == true) {                    
                    if (moment(Date.parse(doc.validTo)) >= moment()) {
                                               
                        notifications.push(doc);
                        callback();
                    }
                    else {
                        //console.log('test111');
                        callback();
                    }
                }
                else {
                    //console.log('test123');
                    callback();
                }
            }
            else {
                callback();
            }
        }, function(err) {
            if (err) {

            }
            else {
                res.send(notifications);
            }
        });
    });
});

app.get('/document/:doc', function(req, res) {
    notifydb.find({}, function(err, doc) {

    });
});


app.post('/add', function(req, res) {
    var data = req.body;
    notifydb.insert({
        document: data.document,
        description: data.description,
        valid: data.valid,
        validTo: data.validTo,
        detaildescription: data.detaildescription
    }, function(err, newNotification) {
        res.send(newNotification);
    });
});

app.post('/update', function(req, res) {
    var data = req.body;
    console.log(data)

    notifydb.update({
        _id: data.id
    }, {
        $set: {
            document: data.document,
            description: data.description,
            valid: data.valid,
            validTo: data.validTo,
            detaildescription: data.detaildescription
        }
    }, {
        multi: false
    }, function(err, numReplaced) {
        res.send({
            updated: numReplaced
        });
    });
});

app.post('/delete', function(req, res) {
    var data = req.body;
    //res.send({removed: 1});
    notifydb.remove({
        _id: data.id
    }, {}, function(err, numRemoved) {
        res.send({
            removed: numRemoved
        });
    });
});


app.set('port', process.env.PORT || config.main.port);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});
