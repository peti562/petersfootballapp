var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTION_STRING||'mongodb://localhost/footballDB', function() {
  console.log("DB connection succesfully established!!!");
})

var fixtureSchema = new mongoose.Schema({
  Date: String,
  Season: Number,
  HomeTeam: String,
  AwayTeam: String,
  HomeGoals: Number,
  AwayGoals: Number,
  Division: Number,
  Tier: Number,
  TotalGoals: Number,
  GoalDifference: Number,
  Result: String
})

var Fixture = mongoose.model('Fixture', fixtureSchema,'seasons');

var app = express();

app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(express.static('database'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var handler = function(res) {
  return function(err, data) {
    if (err) {
      throw err;
    }
    res.send(data);
  }
};


app.get('/seasons/:fixtureID', function (req, res, next) {
  Fixture.find({Season: req.params.fixtureID},function (error, fixtures) {
    if (error) {
      return next(error);
    } else {
      return res.send(fixtures);
    }
  });
});


// app.get('/epl', function(req, res) {
//   Post.find(handler(res));
// });

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running, lets kick some balls.");
});
