/*         
	Movie structure:
	
	movie id | movie title | release date | video release date |
	IMDb URL | unknown | Action | Adventure | Animation |
	Children's | Comedy | Crime | Documentary | Drama | Fantasy |
	Film-Noir | Horror | Musical | Mystery | Romance | Sci-Fi |
	Thriller | War | Western |
	*/

	/*var data = {"movie": {"id": elem[0], "title": elem[1],"release-date": elem[2], 
	"video-release-date": elem[3], "url": elem[4]}};

	console.log(movie);
	var movie = new Movie(data.movie);

	movie.save(function (err) {
		if (!err) {
			console.log("created movie");
			return res.status(201).json(movie.toObject());
		} else {
			return res.status(500).json(err);
		}
	});*/

var fs = require('fs');
var	parse = require('csv-parse');
var request = require('supertest');
var app = require('./app.js');
var readline = require('readline');
var redis = require('redis');

var	moviesPath = './dataset/u.item',
userPath = './dataset/u.user',
genrePath = './dataset/u.genre',
dataPath = './dataset/u.data',
occupationPath = './dataset/u.occupation';

var client; 

var redisConfiguraton = function(){

	client = redis.createClient();

	client.on('connect', function(){
		console.log('Connect with Redis!');
	});

}

var parserMovie = parse({delimiter: '|' }, function(err, data){

	var i = 0;
	console.log("[DEBUG] In parserMovie");
	data.forEach(function(elem){

		request(app)
		.post('/api/movie')
		.set('Accept', 'application/json')
		.send({"movie": {"Id": elem[0], "Title": elem[1],"Release_date": elem[2], "Video_release_date": elem[3], "Url": elem[4]}})
		.end(function(err, res) {
			if (err) {
				console.log(err);
				throw err;
			}
			_id = res.body._id;
		});

		i+=1;
	})

	console.log("Movies " + i);
});

var parserUser = parse({delimiter: '|' }, function(err, data){

	var i = 0;
	data.forEach(function(elem){

		request(app)
		.post('/api/user')
		.set('Accept', 'application/json')
		.send({"user": {"Id": elem[0], "Age": elem[1],"Gender": elem[2], 
			"Work": elem[3], "Zip": elem[4]}})
		.end(function(err, res) {
			if (err) {
				console.log(err);
				throw err;
			}
			_id = res.body._id;
		});

		i+=1;
	})
});

var parserGenre = parse({delimiter: '|' }, function(err, data){

	var i = 0;
	data.forEach(function(elem){

		request(app)
		.post('/api/genre')
		.set('Accept', 'application/json')
		.send({"genre": {"Id": elem[1], "Name": elem[0]}})
		.end(function(err, res) {
			if (err) {
				console.log(err);
				throw err;
			}
			_id = res.body._id;
		});

		i+=1;
	})
});

var parserOccupation = parse({delimiter: '|' }, function(err, data){

	var i = 1;
	data.forEach(function(elem){

		request(app)
		.post('/api/occupation')
		.set('Accept', 'application/json')
		.send({"occupation": {"Id": i, "Name": elem[1]}})
		.end(function(err, res) {
			if (err) {
				console.log(err);
				throw err;
			}
			_id = res.body._id;
		});

		i+=1;
	})
});


var parserRating = parse({delimiter: '\t'}, function(err, data){

	var ratings = [943];
	var jsonObj = {};
	var i = 0;

	/* { userId : { movieId: ratings }} */
	data.forEach(function(elem){

		jsonObj.userId = elem[0];
		jsonObj.ratedMovies = [];

		ratings[elem[0]] = jsonObj;
		jsonObj = {};
	});

	data.forEach(function(elem){

		var movieObj = {};

		movieObj.movieId = elem[1];
		movieObj.rating = elem[2];

		ratings[elem[0]].ratedMovies.push(movieObj);
	});

	ratings.forEach(function(elem){
		
		i += 1;
		client.hmset(elem.userId, elem.ratedMovies);
	});

	console.log("[DEBUG] Save on Redis " + i + " record.");

	/*******************/
});

var parserRating2 = parse({delimiter: '\t'}, function(err, data){

	var i = 1;
	var mongoose = require('mongoose'),
	Rating = mongoose.models.Rating;

	data.forEach(function(elem){

		var rating = new Rating({"User_id": elem[0], "Item_id": elem[1], "Rating": elem[2],
			"Timestamp": elem[3]});
			/*
			rating.User_id = elem[0];
			rating.Item_id = elem[1];
			rating.Rating = elem[2];
			rating.Timestamp = elem[3];
			*/
			rating.save(function (err) {
				if (!err) {
					console.log("created rating");
					return "";
				} else {
					return "";
				}
			});

			/*
			if(i <= 1000){

				request(app)
				.post('/api/rating')
				.set('Accept', 'application/json')
				.send({"rating": {"User_id": elem[0], "Item_id": elem[1], "Rating": elem[2],
									"Timestamp": elem[3]}})
				.end(function(err, res) {
					if (err) {
						console.log(err);
						throw err;
					}
					_id = res.body._id;
				});

}*/

i+=1;
})

	console.log("FINITO")
});

var	parsing = function(){

	var arg;	
	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	rl.question("[+] Inserisci cosa vuoi parsare: (| user | movie | genre | occupation |)\n", function(answer) {

		arg = answer;
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
		rl.close();
	});

	console.log("[DEBUG] Parsing and Save " + arg + " data");
}

redisConfiguraton();
parsing();

