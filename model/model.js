var mongoose = require('mongoose');

var serviceControllerSchema = mongoose.Schema({
	name: {type: String, index: {unique: true}},
	completed: { type: Boolean, default: false },
	createdAt: Date,  
	updatedAt: Date
});

serviceControllerSchema.pre('save', function(next, done){
	  if (this.isNew) {
	    this.createdAt = Date.now();
	  }
	  this.updatedAt = Date.now();
	  next();
});

var serviceCntrlModel = mongoose.model('serviceCntrl',serviceControllerSchema);
module.exports = serviceCntrlModel;