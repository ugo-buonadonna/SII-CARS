'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	Id: { type: String },
	Name: { type: String },
    Users: [{ type: ObjectId,ref: 'User' }]
};

var occupationSchema = new Schema(fields);

module.exports = mongoose.model('Occupation', occupationSchema);
