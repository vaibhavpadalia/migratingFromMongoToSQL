require('./model/model');
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var fs = require('fs');
mongoose.Promise = require('bluebird'); // To remove deprecation warning of mpromise
var mysql = require('mysql');

mongoose.connect('mongodb://localhost:27017/dbChange', {useMongoClient: true});

var app = module.exports = express();

var NODE_ENV = 'development';
app.set('env', process.env.NODE_ENV || 'production');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

routes = require('./routes/routes');

app.use('/api', routes);

var port = process.env.PORT || 8888;

app.listen(port);

console.log('Server starts on port ' + port);
