var express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	todoCntrlModel = require('./model/model'),
	server = require('http').Server(app),
	io = require('socket.io').listen(server),
	bunyan = require('bunyan'),
	bformat = require('bunyan-format'), 
	formatOut = bformat({ outputMode: 'short' });

var log = bunyan.createLogger({ name: 'myMeanApp', stream: formatOut, level: 'debug' } );

mongoose.connect('mongodb://localhost/todoList',function(err,res){
	if(err){
		log.error(err, new Error('mongodb connection'));
	}else{
		log.info('Connected to mongodb');
	}
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/todos', function (req, res) {
	todoCntrlModel.find({}).sort({completed:1,updatedAt: 'descending'}).exec(function(err,results){
		res.json(results);
	});
});

app.get('/todos/:id', function (req, res) {
	todoCntrlModel.findOne({_id : req.params.id},function(err,results){
		res.json(results);	
	});
});

io.on('connection', function (socket) {
	function eventEmitter(){
		socket.broadcast.emit('socketEvent',{data:"testing random data"});
	}
	
	app.post('/todos', function (req, res) {
		var serviceCntrl = new todoCntrlModel(req.body);
		serviceCntrl.save(function(err,result){
			if(err){
				return res.status(500).send(err);
			}
			log.info('Todo is created Sucessfully');
			eventEmitter();
			res.send(result);
		});
	});
	
	app.delete('/todos/:id', function (req, res) {
		todoCntrlModel.remove({_id : req.params.id}, function(err, doc){
			if(err){
				throw err;
			}
			log.info('Todo is deleted Successfully');
			eventEmitter();
			res.json(doc);
		});
	});
	
	app.put('/todos/:id', function (req, res) {
		todoCntrlModel.findById(req.params.id, function(err, doc, next){
			if(err){
				throw err;
			}
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
					log.error(err, new Error('REST Service'));
				}
				log.info('Todo is modified Successfully');
				eventEmitter();
				res.json(doc);
			});		
		});
	});
});

server.listen(3000);
log.info("Server running on port 3000");

module.exports = app;