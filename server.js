// MEAN Stack RESTful API Tutorial - Contact List App

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var serviceCntrlModel = require('./model/model');

mongoose.connect('mongodb://localhost/serviceList',function(err,res){
	if(err){
		console.log('Error connnecting mongodb: '+err);
	}else{
		console.log('Connected to mongodb');
	}
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/serviceClients', function (req, res) {
	console.log('I received a GET request');
	serviceCntrlModel.find({}).sort({completed:1,updatedAt: 'descending'}).exec(function(err,results){
		res.json(results);
	});
});

app.post('/serviceClients', function (req, res) {
	var serviceCntrl = new serviceCntrlModel(req.body);
	serviceCntrl.save(function(err,result){
		if(err){
			return res.send(500, err);
		}	
		res.json(result);
		console.log("post value is "+JSON.stringify(result));
	});
});

app.delete('/serviceClients/:id', function (req, res) {
	serviceCntrlModel.remove({_id : req.params.id}, function(err, doc){
		if(err){
			throw err;
		}		
		res.json(doc);
	});
});

app.get('/serviceClients/:id', function (req, res) {
	serviceCntrlModel.findOne({_id : req.params.id},function(err,results){
		res.json(results);
	});
});

app.put('/serviceClients/:id', function (req, res) {
	serviceCntrlModel.findById(req.params.id, function(err, doc){
		if(err){
			throw err;
		}		
		//console.log(doc);
		if(req.body.name !== doc.name) {
			doc.name = req.body.name;
			doc.completed = false;
		}
		else {
			doc.name = req.body.name;
			doc.completed = req.body.completed;
		}
		doc.save(function(err){
			if(err){
				throw err;
			}
			res.json(doc);
			console.log("put value is "+JSON.stringify(doc));
		});		
	});
});

app.listen(3000);
console.log("Server running on port 3000");