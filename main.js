/**
 * Created by ugo on 26/09/15.
 */


var redis = require('redis');
var similarity_algorithm = require('./models/similarity_compute.js');

const RIGHE = 15;


//PRECONDIZIONE: parsing già effettuato

var client  = redis.createClient();

client.on('connect', function(){
    console.log('Connected to Redis!');
});

console.log('[DEBUG] Creating Similarity Matrix');

var algorithm = new similarity_algorithm(client);

algorithm.compute(RIGHE);
