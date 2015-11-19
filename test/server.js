require('../index').start();
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var baucis = require('baucis');
var request = require('request');

// __Main Program__

// Connect to the Mongo instance
mongoose.connect('mongodb://localhost/baucis-example');

// Create a Mongoose schema
var Vegetable = new mongoose.Schema({ name: String });

// Note that Mongoose middleware will be executed as usual
Vegetable.pre('save', function (next) {
  console.log('A vegetable was saved to Mongo: %s.', this.get('name'));
  next();
});

// Register the schema
mongoose.model('vegetable', Vegetable);

// Create dummy data
var names = [ 'tomato', 'turnip', 'lovage', 'snap pea', 'carrot', 'zucchini' ];
var vegetables = names.map(function (name) { return { name: name } });

// Clear the database of old vegetables
mongoose.model('vegetable').remove(function (error) {
  if (error) throw error;

  // Put the fresh vegetables in the database
  mongoose.model('vegetable').create(vegetables, function (error) {
    if (error) throw error;

    // Create the API routes
    baucis.rest('vegetable');

    // Create the app and listen for API requests
    var app = express();
    app.use(bodyParser.urlencoded());
    app.use(bodyParser.json());
    app.use('/api', baucis());
    app.get('/http',function(req, res){
        request('https://api.github.com/users/osmanson', function (error, response, body) {
            if (!error && response.statusCode === 200) {
                res.json(body);
            } else {
                res.status(500).json(error);
            }
        })
    });
    app.all('/*', function(req, res){
        res.json({success:true});
    });
    app.listen(3333);

    console.log('Server listening on port 3333.');
  });
});
