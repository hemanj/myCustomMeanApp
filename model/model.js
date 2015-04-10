var mongoose = require('mongoose');

var todoControllerSchema = mongoose.Schema({
	name: {type: String, index: {unique: true}},
	completed: { type: Boolean, default: false },
	createdAt: Date,  
	updatedAt: Date
});

todoControllerSchema.pre('save', function(next, done){
	  if (this.isNew) {
	    this.createdAt = Date.now();
	  }
	  this.updatedAt = Date.now();
	  next();
});

var todoCntrlModel = mongoose.model('todoCntrl',todoControllerSchema);
module.exports = todoCntrlModel;