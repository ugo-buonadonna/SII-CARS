'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	Id: { type: String },
	Name: { type: String },
    Movies: [{ type: ObjectId,ref: 'Movie' }]
};

var genreSchema = new Schema(fields);

module.exports = mongoose.model('Genre', genreSchema);
