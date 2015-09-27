'use strict';
/**
 * Created by ugo on 26/09/15.
 */


var redis = require('redis');
var bluebird = require('bluebird')
var similarity_algorithm = require('./models/similarity_compute.js');
var context = require('./context.js');
var parser = require('./parser.js');
var algorithm = require('./models/algorithm.js');
var Q = require('q');

const FILM_NUMBER = 3;


bluebird.promisifyAll(redis.RedisClient.prototype);


var client  = redis.createClient();

client.on('connect', function(){
    console.log('Connected to Redis!');
});


 console.log('[DEBUG] Parsing test.data file');

 parser.parse(client);


 console.log('[DEBUG] Adding contextual random informations');

 // Add contextual random informations
 context.create_context_data(client,FILM_NUMBER);

 console.log('[DEBUG] Creating Similarity Matrix');

 var sim_algorithm = new similarity_algorithm(client);








 console.log('[DEBUG] Calculating t-mean');

 // Calculate t-mean



console.log('[DEBUG] Adding contextual random informations');

/*
var prova = client.hgetall('movieId-11');
console.log(`${JSON.stringify(prova)}`)
prova.then((obj) => {console.log(JSON.stringify(obj))})
*/


// Add contextual random informations
context.create_context_data(client,FILM_NUMBER);
client.quit();

client  = redis.createClient();

var ttest_metric = Q.defer(), end_compute = Q.defer();


console.log('[DEBUG] Computing best contextual splitting condition');

client.hgetall("movieId-1", (err, movie) => {
    let movie_data = [];

    // Per adattarlo al formato richiesto
    for( let el in movie ){
        movie_data.push(JSON.parse(movie[el]));
    }

    //console.log(movie_data);
    let contextual_dataset = {
        contextual_variable: 'mood',
        movies: movie_data
    }
    let contextual_parameter = 'mood';

    //console.log(`movie 1 t-mean: ${algorithm.t_mean(contextual_dataset, contextual_parameter)}`);
    //ttest_metric.resolve(algorithm.t_mean(contextual_dataset, contextual_parameter));

    ttest_metric.resolve({
        "result": 0.5720775535473555,
        "context": "mood",
        "contextual_value": "negative"
    })
})



ttest_metric.promise.then( (t_mean_result) => {

    var all_movies_array = [];
    console.log(`[DEBUG] Selected ${t_mean_result.context} whether ${t_mean_result.contextual_value} or not as best splitting criterion`)

    console.log('[DEBUG] Splitting items');


    for( let i=1; i < FILM_NUMBER + 1; i++ ){

        //console.log("[DEBUG] Current i --> " + i);
        client.hgetall("movieId-" + i, (err, movie) => {

            //console.log(`\n[] movie: ${JSON.stringify(movie)} \n`);
            for (let el in movie) {
                if ( movie.hasOwnProperty(el) ) {
                    let movie_data = JSON.parse(movie[el]);
                    //console.log(`[] movie_data: ${JSON.stringify(movie_data)}`);
                    if ( movie_data[t_mean_result.context] == t_mean_result.contextual_value ) {
                        //console.log(`[] 1`);
                        all_movies_array.push({movieId: '' + i + 1, rating: movie_data.rating})
                        client.hmset("movieId-" + i + 1, el, JSON.stringify({rating: movie_data.rating}));
                        
                        /* Rimozione vecchio ratings per aggiornare con il rating del movie splittato */
                        client.del(el);
                        client.hmset(el, "movieId-" + i + 1, JSON.stringify({rating: movie_data.rating}));
                    }
                    else {
                        //console.log(`[] 2`);
                        all_movies_array.push({movieId: '' + i + 2, rating: movie_data.rating})
                        client.hmset("movieId-" + i + 2, el, JSON.stringify({rating: movie_data.rating}));

                        /* Rimozione vecchio ratings per aggiornare con il rating del movie splittato */
                        client.del(el);
                        client.hmset(el, "movieId-" + i + 2, JSON.stringify({rating: movie_data.rating}));

                    }
                    if( i === FILM_NUMBER ) {


                    }
                }
            }
        })
    }

   // console.log(`[DEBUG] Splitted Movies: ${JSON.stringify(all_movies_array,null,2)}`)
    console.log(`[DEBUG] Saved on redis splitted movies`)

    console.log('[DEBUG] Computing cosine similarity');

    // Compute cosine similarity
   // sim_algorithm.compute(FILM_NUMBER);

    sim_algorithm.compute_splitted(FILM_NUMBER);

    // Predict movie1 for user1

})








