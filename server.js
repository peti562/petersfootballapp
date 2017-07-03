var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/footyDB', function() {
  console.log("DB connection succesfully established!!!");
})

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

app.get('/epl', function(req, res) {
  Post.find(handler(res));
});

app.listen(3000, function() {
  console.log("Server is running, lets kick some balls.");
});
