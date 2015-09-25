'use strict'

var request = require('supertest');
var readline = require('readline');
var redis = require('redis');
var math = require('mathjs');

var app = require('./app.js');

var client;

var redisConfiguraton = function(){

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

	for(var i = 1; i < 1683; i++){

		var mood = "";
		var domEmo = "";

		/* MOOD */
		if(i <= 504){
			mood = "neutral";
		}

		if(505 <= i <= 1345){
			mood = "positive";
		}

		if(1346 <= i <= 1682){
			mood = "negative"
		}
		/********/

		if(i <= 336){
			domEmo = "sad";
		}

		if( 337 <= i <= 504){
			domEmo = "happy";
		}

		if( 505 <= i <= 673){
			domEmo = "scared";
		}

		if( 674 <= i <= 1010 ){
			domEmo = "surprised";
		}

		if( 1011 <= i <= 1191 ){
			domEmo = "angry";
		}

		if( 1192 <= i <= 1528 ){
			domEmo = "disgusted;"
		}

		if( 1529 <= i <= 1682 ){
			domEmo = "neutral";
		}

		client.hgetall("movieId-" + i, function(err, movie){

			for(var key in object){
				
				var movie_info = object[key];
				var movieObj = {

					"movieId": i,
					"rating": movie_info.rating,
					"mood": mood,
					"domEmo":domEmo
				};

				client.hmset(key, "ratedMovie-" + i, JSON.stringify(movieObj));
				client.hmset("movieId-" + i, key, JSON.stringify(movieObj));
			}
		});	
	}
}

create_context_data();