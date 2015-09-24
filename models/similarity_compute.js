/**
 * Created by ugo on 23/09/15.
 */


'use strict';
//Precondizione: i valori di ratings devono essere già presenti in redis
var algorithm = require('./algorithm.js');

class similarity_compute {


    constructor(redis_connection) {
        this.redis = redis_connection;
    }

    _getSimilarity(movie1,movie2) {
        let ratings1 = [], ratings2 = [];
        for(let i in movie1)
            if(movie1.hasOwnProperty(i) && movie2.hasOwnProperty(i)) {
                ratings1.push(JSON.parse(movie1[i]).rating);
                ratings2.push(JSON.parse(movie2[i]).rating);

            }
        let sim = algorithm.cosine_similarity(ratings1,ratings2);
        if(isNaN(sim))
            sim=0;
        return sim;
    }
    compute() {
        for (let i = 0; i < 20; i++) {
            this.redis.hgetall("movieId-" + i, (err, movie1) => {
                for (let j = i; j < 1682; j++) {
                    this.redis.hgetall("movieId-" + j, (err, movie2) => {
                        let key = `(movieId-${j},movieId-${i})`;
                        let similarity = this._getSimilarity(movie1, movie2);

                       // console.log(`${key} = ${similarity}`)
                        this.redis.set(key,similarity);
                    })
                }
            })
        }
        console.log('[DEBUG] Done')
    }

}


module.exports = similarity_compute;
