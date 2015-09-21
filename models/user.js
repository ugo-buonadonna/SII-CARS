'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	Id: { type: String },
	Age: { type: Number },
	Zip: { type: String },
    Gender: [{ type: ObjectId,ref: 'Genre' }],
    Rated_movies: [{ type: ObjectId,ref: 'Movie' }]
};

var userSchema = new Schema(fields);
userSchema.methods.getRatedMovies = function () {
    return this.model('User').find({},{Rated_movies : 1});
};


module.exports = mongoose.model('User', userSchema);
