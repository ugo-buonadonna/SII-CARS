'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	Id: { type: String },
	Age: { type: String },
	Gender: { type: String },
	Work: { type: String },
	Zip: { type: String	 }
};

var userSchema = new Schema(fields);

module.exports = mongoose.model('User', userSchema);
