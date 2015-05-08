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
	request = require('request');

var moviesPath = './dataset/u.item',
	userPath = 'dataset/u.user',
	genrePath = 'dataset/u.genre',
	dataPath = 'dataset/u.data';

var moviesApi = ""

var parserMovie = parse({delimiter: '|' }, function(err, data){

	request.post(
		"http://localhost:3000/api/movie", 
		
		{ form: {Id: data[0][0], Title: data[0][1], Release_date: data[0][2], Video_release_date: data[0][3], Url: data[0][4]}},
		
		function (error, response, body) {
	        if (!error && response.statusCode == 200) {
	            console.log(body)
	        }
    });
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