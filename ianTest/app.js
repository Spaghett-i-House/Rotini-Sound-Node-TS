var express = require("express");
var bodyParser = require("body-parser");
var routes = require("./routes/routes.js");
const MongoClient = require('mongodb').MongoClient

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
var db;
var res;
//res.render(view, locals)

MongoClient.connect('mongodb+srv://blake:doge@rotiniusers-ol8zy.mongodb.net/test?retryWrites=true&w=majority', (err, database) => {
    // ... start the server
    if (err) return console.log(err)
    db = database.db('RotiniUsers') // whatever your database name is

    var server = app.listen(4200, function () {
        console.log("app running on port.", server.address().port);
    })

  })

routes(app);


app.get("/", function (req, res) {
    var cursor = db.collection('quotes').find()
    db.collection('quotes').find().toArray(function(err, results) {
        if (err) return console.log(err)
      // send HTML file populated with quotes here
      db.collection('bgcolor').find().toArray(function(err, output) {
          if (err) return console.log(err)
          res.render('index.ejs', {quotes: results, bgColor: output})
      })
      
    })
  });

app.post('/quotes', (req, res) => {
    db.collection('quotes').insertOne(req.body, (err, result) => {
      if (err) return console.log(err)
  
      console.log('saved to database')
      res.redirect('/')
    })
  })

  app.post('/color', (req, res) => {
      var myquery = {user: "ben"};
    db.collection('bgcolor').updateOne(myquery,req.body, (err, result) => {
      if (err) return console.log(err)
  
      console.log('saved to database')
      res.redirect('/')
    })
  })

