/*         
	Movie structure:
	
	movie id | movie title | release date | video release date |
	IMDb URL | unknown | Action | Adventure | Animation |
	Children's | Comedy | Crime | Documentary | Drama | Fantasy |
	Film-Noir | Horror | Musical | Mystery | Romance | Sci-Fi |
	Thriller | War | Western |
	*/

	var fs = require('fs');
	var	parse = require('csv-parse');

	
	var	moviesPath = './dataset/u.item';
	var userPath = './dataset/u.user';
	var genrePath = './dataset/u.genre';
	var dataPath = './dataset/u.data';

	/* Import models */ 
	var mongoose = require('mongoose'),
	Movie = mongoose.models.Movie;

	
	var moviesApi = ""

	var parserMovie = parse({delimiter: '|' }, function(err, data){

		console.log("[DEBUG] In parserMovie");
		data.forEach(function(elem){
			
			console.log("\n=== Print movie information ===" +
				"\nid : " + elem[0] + 
				"\ntitle : " + elem[1] + 
				"\nrelease-date : " + elem[2] + 
				"\nvideo-release-date : " + elem[3] + 
				"\nurl : " + elem[4] + 
				"\n================================")


			/*var data = {"movie": {"id": data[0][0], "title": data[0][1],"release-date": data[0][2], 
			"video-release-date": data[0][3], "url": data[0][4]}};
			var movie = new Movie(data.movie);

			movie.save(function (err) {
				if (!err) {
					console.log("created movie");
					return res.status(201).json(movie.toObject());
				} else {
					return res.status(500).json(err);
				}
			});*/
		})


		/*request(app)
		.post('/api/movie')
		.set('Accept', 'application/json')
		.send({"movie": {"id": data[0][0], "title": data[0][1],"release-date": data[0][2], "video-release-date": data[0][3], "url": data[0][4]}})
		.end(function(err, res) {
			if (err) {
				console.log(err);
				throw err;
			}
			_id = res.body._id;
			console.log("[SUCCESS POST] Insert movie with id --> ", _id);
			done();
		});*/
});

var moviesOutput = [];
var userOutput = [];
var genreOutput = [];
var dataOutput = [];


var parsing = function() {

	fs.readFile('./message.txt', 'utf8', function (err, data) {
		if (err) console.log(err);
		console.log(data);
	});
}

var	parsingMovies = function(){

		/*
		fs.writeFile('message.txt', 'Hello Node', function (err) {
			if (err) throw err;
			console.log('It\'s saved!');
		});*/

var moviesStream = fs.createReadStream(moviesPath, { encoding: 'utf8' }).pipe(parserMovie);
}

parsingMovies();





