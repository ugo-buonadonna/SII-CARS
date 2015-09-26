'use strict';
/**
 * Created by ugo on 26/09/15.
 */


var redis = require('redis');
var similarity_algorithm = require('./models/similarity_compute.js');
var context = require('./context.js');
var parser = require('./parser.js');
var algorithm = require('./models/algorithm.js');


const FILM_NUMBER = 3;

var client  = redis.createClient();

client.on('connect', function(){
    console.log('Connected to Redis!');
});

/*
console.log('[DEBUG] Parsing test.data file');

parser.parse(client);


console.log('[DEBUG] Adding contextual random informations');

// Add contextual random informations
context.create_context_data(client,FILM_NUMBER);

console.log('[DEBUG] Creating Similarity Matrix');

var sim_algorithm = new similarity_algorithm(client);


console.log('[DEBUG] Computing cosine similarity');

// Compute cosine similarity
sim_algorithm.compute(FILM_NUMBER);


console.log('[DEBUG] Calculating t-mean');

// Calculate t-mean

*/

console.log('[DEBUG] Adding contextual random informations');

// Add contextual random informations
//context.create_context_data(client,FILM_NUMBER);

setTimeout( () => {
        client.hgetall("movieId-1", (err, movie) => {
            if (err) console.error('ERRORE A PRENDERE');
            let contextual_dataset = {
                contextual_variable: 'mood',
                movies: [movie]
            }
            let contextual_parameter = 'mood';

            console.log(`movie 1 t-mean: ${algorithm.t_mean(contextual_dataset, contextual_parameter)}`);
        })
    },
    3000
)


