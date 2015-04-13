var app = require('../server'),
	should = require('chai').should(),
	supertest = require('supertest'),
	mongoose = require('mongoose'),
	todoCntrlModel = require('../model/model');
var url = 'http://localhost:3000';

describe('GET /todos', function() {
	it('Get should respond with JSON Object', function(done) {
		supertest(url)
		.get('/todos')
		.set('Accept', 'application/json')
		.expect(200,function(err,res) {
			if (err) {
				return done(err);
			}
			res.status.should.equal(200);
			res.should.be.an('object');
			done();
		});
	});
});

describe('POST /todos', function() {
	var todoData = {
			name: 'Post Test',
	};
	var id='';
	
	after(function(done) {
		todoCntrlModel.remove({_id : id}).exec();
		done();
	});
	
	it('Should Respond with added todo', function(done) {
		supertest(url)
		.post('/todos')
		.send(todoData)
		.expect('Content-Type', /json/)
		// end handles the response
		.end(function(err, res) {
			if (err) {
				return done(err);
			}
			var data = JSON.parse(res.text);
			id = data._id;
			res.should.have.property('statusCode', 200);
			done();
		});
	});
	
	it('Should Respond with error', function(done) {
		supertest(url)
		.post('/todos')
		.send(todoData)
		.expect(500)
		.end(done);
	});
});

describe('GET /todos/:todoId', function() {
	var testPutName = 'Get Test Todo updated';
	var todo = {};

	beforeEach(function(done) {
		todo = new todoCntrlModel({
	      name: testPutName,
	      completed: false
	    });

	    todo.save(function(err) {
	      done();
	    });
	});
	
	afterEach(function(done) {
		todoCntrlModel.remove({_id : todo._id}).exec();
		done();
	});
	
	function sendRequest() {
		return supertest(app)
		.get('/todos/' + todo._id);
	}

	it('should respond with 200', function(done) {
		sendRequest()
		.expect(200).end(done);
	});

	it('should Get particular todo from database', function(done) {
		sendRequest()
		.end(function(err,res) {
			var data = JSON.parse(res.text);
			data.should.have.property('name');
			data.name.should.equal(testPutName);
			done();
		});
	});
});

describe('PUT /todos/:todoId', function() {
	  var todo = {},
	      updatedName = 'newTitle';
	  
	  var body = {
			name:updatedName,
			completed:true
	  };
	  
	  var elsebody = {
			name:'ToDo Test One',
			completed:true
	  };

	  beforeEach(function(done) {
	    todo = new todoCntrlModel({
	      name: 'ToDo Test One'
	    });

	    todo.save(function(err) {
	    	done();
	    });
	  });

	  afterEach(function(done) {
		  todoCntrlModel.remove({_id : todo._id}).exec();
		  done();
	  });

	  function sendRequest(body) {
		  return supertest(app)
	      .put('/todos/' + todo._id)
	      .send(body);
	  }

	  it('should respond with todo', function(done) {
		  sendRequest(body)
		  .expect(200)
		  .expect('Content-Type', /json/)
		  .end(done);
	  });

	  it('should update todo in database', function(done) {
	    sendRequest(body)
	      .end(function() {
	    	  todoCntrlModel.findById(todo._id, function(err, updatedTodo) {
	    		  updatedTodo.name.should.equal(updatedName);
	    		  updatedTodo.completed.should.equal(false);
	    		  done();
	        });
	      });
	  });
	  
	  it('should return complete as true', function(done) {
		  sendRequest(elsebody)
		  .end(function() {
			  todoCntrlModel.findById(todo._id, function(err, updatedTodo) {
				  updatedTodo.completed.should.equal(true);
				  done();
			  });
		  });
	  });
	  
	  it('should throw error', function(done) {
		  supertest(app)
	      .put('/todos/5')
	      .expect(500)
	      .end(done);
	  });
});

describe('DEL /todos/:todoId', function() {
	  var todo = {};

	  beforeEach(function(done) {
	    todo = new todoCntrlModel({
	      name: 'todo Name',
	      completed: false
	    });

	    todo.save(function(err) {
	      done();
	    });
	  });
	  
	  afterEach(function(done) {
		  todoCntrlModel.remove({_id : todo._id}).exec();
		  done();
	  });

	  function sendRequest() {
	    return supertest(app)
	      .del('/todos/' + todo._id);
	  }

	  it('should respond with 200', function(done) {
	    sendRequest()
	      .expect(200).end(done);
	  });

	  it('should delete the todo from the database', function(done) {
	    sendRequest()
	      .expect(200).end(function() {
	    	  todoCntrlModel.find({}, function(err, todos) {
	          done();
	        });
	      });
	  });
});