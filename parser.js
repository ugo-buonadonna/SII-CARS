

'use strict'

var fs = require('fs');
var	parse = require('csv-parse');
var request = require('supertest');
var readline = require('readline');
var redis = require('redis');
var math = require('mathjs');

var	moviesPath = './dataset/u.item',
	userPath = './dataset/u.user',
	genrePath = './dataset/u.genre',
	dataPath = './dataset/test.data',
	occupationPath = './dataset/u.occupation';

var Algorithm = require('./models/algorithm.js');



var	parsing = function(client){

    var parserRating = parse({delimiter: '\t'}, function(err, data){

        var ratings = [];
        var jsonObj = {};
        var i = 0;

        /* { userId : { movieId: ratings }} */
        data.forEach(function(elem){

            /* DA VEDERE SE ELIMANARE
             jsonObj.userId = elem[0];
             jsonObj.ratedMovies = [];

             ratings[elem[0]] = jsonObj;
             jsonObj = {};
             */

            //ParseInt dà null perchè elem = ' 1 1 5 233232'
            ratings.push(parseInt(elem[2]));
            i += 1;
        });

        i = 0;
        var normalized_ratings = Algorithm.mean_normalize(ratings);

        data.forEach(function(elem){

            var movieObj = {};
            var userId = elem[0];

            movieObj.movieId = elem[1];
            movieObj.rating = elem[2];
            //movieObj.rating = normalized_ratings[i];
            i += 1;

            client.hmset("userId-" + userId, "ratedMovie-" + movieObj.movieId, JSON.stringify(movieObj));
            client.hmset("movieId-" + movieObj.movieId, "userId-" + userId, JSON.stringify(movieObj));
        });

        // TOTAL MOVIES = 1682
        /* Caricamento di tutti i movie all'interno di redis
         * Normalizzazione di tutti i ratings di un determinato movie
         * Salvataggio su Redis dei nuovi ratings normalizzati, questo andrà a sovrascrivere
         * i vecchi valori.
         */
        for(let i = 1; i <= 3; i++){

            client.hgetall("movieId-" + i, function(err, object){

                var movieResult = object;
                var ratings = [];
                var normalized_ratings = [];

                for(var key in object){

                    var movie_info = object[key];
                    var movie_rating = parseInt(JSON.parse(movie_info).rating);

                    ratings.push(movie_rating);
                }

                normalized_ratings = Algorithm.mean_normalize(ratings);

                /* key = userId */
                for(var key in object){

                    var movieObj = {

                        "movieId": i,
                        "rating": normalized_ratings.shift()
                    };

                    client.hmset(key, "ratedMovie-" + i, JSON.stringify(movieObj));
                    client.hmset("movieId-" + i, key, JSON.stringify(movieObj));
                }
            });
        }

        console.log("[DEBUG] Save on Redis " + i + " record.");
    });

	var arg;
	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	//rl.question("[+] Inserisci cosa vuoi parsare: (| user | movie | genre | occupation | ratings | )\n", function(answer) {

		//arg = answer;
        arg = 'ratings';
		switch(arg){
			case "users":
			var usersStream = fs.createReadStream(userPath, { encoding: 'utf8' }).pipe(parserUser);
			break;
			case "movies":
			var moviesStream = fs.createReadStream(moviesPath, { encoding: 'utf8' }).pipe(parserMovie);
			break;
			case "genres":
			var genreStream = fs.createReadStream(genrePath, { encoding: 'utf8' }).pipe(parserGenre);
			break;
			case "occupations":
			var occupationStream = fs.createReadStream(occupationPath, { encoding: 'utf8' }).pipe(parserOccupation);
			break;
			case "ratings":
			var ratingsStream = fs.createReadStream(dataPath, {encoding: 'utf8'}).pipe(parserRating);
			break;
			default:
			var mongoose = require('mongoose'),
			User = mongoose.models.User;
			console.log(User);
			break;
		}
		//rl.close();
	//});

	console.log("[DEBUG] Parsing and Save " + arg + " data");
}

module.exports.parse = parsing;

