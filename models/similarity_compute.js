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

    getSimilarity(movie1,movie2) {
        let ratings1 = [], ratings2 = [];
        if(movie1 == null || movie2 == null)
            return null;

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
    compute(film_number) {
        for (let i = 0; i < film_number; i++) {
            this.redis.hgetall("movieId-" + i, (err, movie1) => {
                for (let j = i; j < film_number; j++) {
                    this.redis.hgetall("movieId-" + j, (err, movie2) => {
                        let key = `(movieId-${j},movieId-${i})`;
                        let similarity = this.getSimilarity(movie1, movie2);

                       // console.log(`${key} = ${similarity}`)
                        this.redis.set(key,similarity);
                    })
                }
            })
        }
        console.log('[DEBUG] Done')
    }

    compute_splitted(film_number) {
        for (let i = 1; i < film_number+1; i++)
            for (let j = i; j < film_number+1; j++)
                for (let x = 1; x < 3; x++)
                    for (let y = x; y < 3; y++) {
                        if(`${i}${x}` == `${j}${y}`)    continue;
                        let key = `(movieId-${i}${x},movieId-${j}${y})`;
                        console.log(`[SIMILARITY] esaminando ${key}`)

                        this.redis.hgetall("movieId-" + i + x, (err, movie1) => {
                            this.redis.hgetall("movieId-" + j + y, (err, movie2) => {
                                let similarity = this.getSimilarity(movie1, movie2);
                                if (similarity != null)
                                    this.redis.set(key, similarity);
                            })
                        })
                    }
    }
}


module.exports = similarity_compute;
