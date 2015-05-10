'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	Id: { type: String },
	Age: { type: Number },
	Zip: { type: Number },
    Gender: [{ type: ObjectId,ref: 'Genre' }],
    Rated_movies: [{ type: ObjectId,ref: 'Movie' }]
};

var userSchema = new Schema(fields);

module.exports = mongoose.model('User', userSchema);
