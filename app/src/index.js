
// Requires
const express = require('express');
const app = express();

var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Setting body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 // parse application/json
app.use(bodyParser.json());

// Setting database connection
// building mongodb uri
const connString = 'mongodb+srv://matias:contra10@cluster0-jssy7.mongodb.net/cartEndeev?retryWrites=true';
// connecting to mongo
mongoose.connect(connString, (err) => {
    if (err) throw err;
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function() {
  console.log('conectado a Mongo');
});


// Server
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log(`🚀 Server ready on port 3000`);
});