/**
 * Created by ugo on 23/09/15.
 */



var redis = require('redis');
var similarity_algorithm = require('./models/similarity_compute.js');


var client  = redis.createClient();

client.on('connect', function(){
    console.log('Connected to Redis!');
});

console.log('[DEBUG] Creating Similarity...');

var algorithm = new similarity_algorithm(client);

algorithm.compute(client);
