'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	Id: { type: String },
	Title: { type: String },
	Release_date: { type: String },
	Video_release_date: { type: String },
	Url: { type: String },
    Genres: [{ type: ObjectId,ref: 'Genre' }],
    Ratings: [{ user: { type: ObjectId, ref: 'User'},
                Rating: {type: Number}
    }]
};

var movieSchema = new Schema(fields);

userSchema.methods.getRatings = function () {
    return this.model('Movie').find({},{ Ratings : {Rating : 1}});
};

userSchema.methods.getUserRating = function (userID) {
    return this.model('User').find({'Ratings.user' : userID},{Rated_movies : 1});
};

module.exports = mongoose.model('Movie', movieSchema);
