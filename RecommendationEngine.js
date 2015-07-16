
var raccoon = require('raccoon'),
	mongoose = require('mongoose');

var app = require('./app.js');


var redisConfig = {
	
	url: '127.0.0.1',
	port: 6379	
};

raccoon.connect(redisConfig.port, redisConfig.url);

var Rating = mongoose.models.Rating;


var setAllUserLiked = function(){

	var mongoose = require('mongoose');
	User = mongoose.models.User;

	var users = User.find(function(err, data){

		console.log("[DEBUG] Stampo dati appena prelevati " + data);
		if(err){
			console.log("[ERROR] C'e stato un errore nel prelievo dei data");
			return;
		}

		data.forEach(function(elem){

			console.log("[DEBUG] Setto liked per utente con id " + elem.Id);
			setUserLiked(elem.Id);
		})

		console.log("[SUCCESS] Settati tutti  i ratings")
	});
};

var recomm = function(id){

	console.log("[DEBUG] Raccomando per utente con id " + id);
	raccoon.recommendFor(id, 4, function(results){

		console.log(results);
	});
}

var setUserLiked = function(id){

	var userRatings = Rating.findOne({ User_id: id }, function(err, data){

		if(err){
			console.log("[ERROR] User id inesistente ( " + id + " )");
			return;
		}

		data.forEach(function(elem){
			raccoon.liked(id, elem.Item_id);
		});

		console.log("[ERROR] Ratings per " + id + " settati correttamente");
	});

	recomm(id);
}

setAllUserLiked();
