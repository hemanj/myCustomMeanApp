// MEAN Stack RESTful API Tutorial - Contact List App

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var todoCntrlModel = require('./model/model');

mongoose.connect('mongodb://localhost/todoList',function(err,res){
	if(err){
		console.log('Error connnecting mongodb: '+err);
	}else{
		console.log('Connected to mongodb');
	}
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/todos', function (req, res) {
	todoCntrlModel.find({}).sort({completed:1,updatedAt: 'descending'}).exec(function(err,results){
		res.json(results);
	});
});

app.post('/todos', function (req, res) {
	var serviceCntrl = new todoCntrlModel(req.body);
	serviceCntrl.save(function(err,result){
		if(err){
			return res.send(500, err);
		}	
		res.json(result);
	});
});

app.delete('/todos/:id', function (req, res) {
	todoCntrlModel.remove({_id : req.params.id}, function(err, doc){
		if(err){
			throw err;
		}		
		res.json(doc);
	});
});

app.get('/todos/:id', function (req, res) {
	todoCntrlModel.findOne({_id : req.params.id},function(err,results){
		res.json(results);	
	});
});

app.put('/todos/:id', function (req, res) {
	todoCntrlModel.findById(req.params.id, function(err, doc, next){
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
		});		
	});
});

app.listen(3000);
console.log("Server running on port 3000");

module.exports = app;