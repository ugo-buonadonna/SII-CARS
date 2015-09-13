'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

var fields = {
	User_id: { type: String },
	Item_id: { type: String },
	Rating: { type: String },
	Timestamp: { type: String }
};

var ratingSchema = new Schema(fields);

module.exports = mongoose.model('Rating', ratingSchema);
