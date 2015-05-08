/*         
	Movie structure:
	
	movie id | movie title | release date | video release date |
	IMDb URL | unknown | Action | Adventure | Animation |
	Children's | Comedy | Crime | Documentary | Drama | Fantasy |
	Film-Noir | Horror | Musical | Mystery | Romance | Sci-Fi |
	Thriller | War | Western |
*/

var fs = require('fs'),
	parse = require('csv-parser'),
 	Movie = require('mongoose').model('Movie').schema;

var moviesPath = './dataset/u.item',
	userPath = 'dataset/u.user',
	genrePath = 'dataset/u.genre',
	dataPath = 'dataset/u.data';

var parserMovie = parse({delimiter: '|' }, function(err, data){

	console.log(data[0]);
})

var moviesOutput = [];
var userOutput = [];
var genreOutput = [];
var dataOutput = [];

module.exports = {

	parsingMovies : function(){

		console.log("[+] Create Stream and read " + moviesPath);
		var moviesStream = fs.createReadStream(moviesPath).pipe(parserMovie);

	}
} 