'use strict'

var request = require('supertest');
var readline = require('readline');
var redis = require('redis');
var math = require('mathjs');

var app = require('./app.js');

var client;

var redis_configuraton = function(){

	client = redis.createClient();

	client.on('connect', function(){
		console.log('Connect with Redis!');
	});

}

// MOOD --> 30% neutral | 50% positive | 20% negative
//			 i < 504   505 <= i <= 1345   1346 <= i <= 1682
//DOMEMO --> 20% sad | 10% happy | 10% scared | 20% surprised | 10% angry | 20% disgusted | 10% neutral 
// 			 i <= 336 | 337<=i<=504 | 505<=i<=673 | 674<=i<=1010 | 1011<=i<=1191 | 1192<=i<=1528 | 1529<=i<=1682
var create_context_data = function(){

	let i = 1;

	for( i = 1; i < 1683; i++){

		let mood = "";
		let domEmo = "";
		let movieId = i;
		let ratedMovie = "ratedMovie-" + i;

		/* MOOD */
		if(i <= 504){
			mood = "neutral";
		}

		if( i >= 505 && i <= 1345){
			mood = "positive";
		}

		if( i >= 1346 && i <= 1682){
			mood = "negative"
		}
		/********/

		if(i <= 336){
			domEmo = "sad";
		}

		if( i >= 337 && i <= 504){
			domEmo = "happy";
		}

		if( i >= 505 && i <= 673){
			domEmo = "scared";
		}

		if( i >= 674 && i <= 1010 ){
			domEmo = "surprised";
		}

		if( i >= 1011 && i <= 1191 ){
			domEmo = "angry";
		}

		if( i >= 1192 && i <= 1528 ){
			domEmo = "disgusted;"
		}

		if( i >= 1529 && i <= 1682 ){
			domEmo = "neutral";
		}

		client.hgetall("movieId-" + movieId, function(err, movie){

			for(let key in movie){
				
				var movie_info = JSON.parse(movie[key]);

				var movieObj = {

					"movieId": movieId,
					"rating": movie_info.rating,
					"mood": mood,
					"domEmo":domEmo
				};

				console.log("[DEBUG] movieObj --> " + movieObj.movieId + " mood --> " + movieObj.mood);

				/*client.del(key, function(err, reply){
					//console.log("[SUCCES] Remove key --> " + key + "\n" + reply);
				});

				client.del(movieId, function(err, reply){
					//console.log("[SUCCES] Remove key --> " + "movieId-" + i + "\n" + reply);

				});*/

				client.hmset(key, ratedMovie, JSON.stringify(movieObj));
				client.hmset("movieId-" + movieId, key, JSON.stringify(movieObj));

			}
		});	
	}

	console.log("[SUCCESS] Save on Redis")

}

redis_configuraton();
create_context_data();