var express = require('express');
var app = express();
var r = require('rethinkdb');
var bodyParser = require('body-parser');

//open a conection to rethinkdb
var connection = null;
r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
    if (err) throw err;
    connection = conn;
});

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());


app.get('/contactlist', function(req, res) {
	console.log('I recived a GET request');
	r.table('contactlist').run(connection, function(err, cursor) {
    if (err) throw err;
    //organize the recived data into aray of JSON objects and return it
    cursor.toArray(function(err, result) {
        if (err) throw err;
        return JSON.stringify(result, null, 2);
    }).then(function(cursor) {
    	//send the response to a controller
    	res.json(cursor);
        console.log(cursor);
    });
	});
    ;
});

app.post('/contactlist',function(req, res) {
	console.log(req.body);
	//insert parsed body of request as JSON object into a database
	r.table('contactlist').insert(req.body).run(connection, function(err, result) {
    if (err) throw err;
    return JSON.stringify(result, null, 2);
    }).then(function(result) {
	//send the response to a controller
	   res.json(result);
    });
});

app.delete('/contactlist/:id', function(req, res) {
    var id = req.params.id;
    console.log(id);
    r.table('contactlist').get(id).delete().run(connection).then(function(result){
        res.json(result);
    });
});

app.get('/contactlist/:id', function(req, res) {
    var id = req.params.id;
    console.log(id);
    r.table('contactlist').get(id).run(connection).then(function(result){
        res.json(result);
    });
});

app.put('/contactlist/:id', function(req, res) {
    var id = req.params.id;
    console.log(req.body.name);
    r.table('contactlist')
    .get(id)
    .update({name: req.body.name,
            email: req.body.email, 
            number: req.body.number})
    .run(connection).then(function(result){
        res.json(result);
    });
});

app.listen(3000);
console.log("Server running at port 3000");