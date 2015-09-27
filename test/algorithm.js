/**
 * Created by ugo on 18/09/15.
 */
    'use strict';

 var algorithm = require('../models/algorithm.js');
 var should = require('should');
 var request = require('supertest');
 var redis = require('redis');

 process.env.NODE_ENV = 'test';

 describe('Algorithm testing', function() {
    describe('Cosine similarity', function () {
        var film1;
        var film2;
        before(() => {
            film1 = [0.6, 1.2, 0.8, -1.8];
            film2 = [0.6, 0.2, -0.2, -1.8];
        });


        it('calculates the right cosine similarity', (done) => {

            var similarity = algorithm.cosine_similarity(film1, film2).toFixed(2);

            console.log("\t[BEFORE] Movies ratings:\n\t\t film1: " + film1 + "\n\t\t film2: " + film2);
            console.log("\t[DEBUG] Similarity --> " + similarity);
            similarity.should.equal('0.80');
            done();
        })
    })

    describe('Normalize rating by mean', function () {
        var user_ratings;
        before(() => {
            user_ratings = [5,3,4,4];
        });

        it('calculates the right mean', (done) => {
            algorithm.mean_normalize(user_ratings).should.eql([1,-1,0,0]);
            done();
        })
    })

    describe('t_mean criterion', function (){

        var contextual_dataset;
        before(() => {
            contextual_dataset = {
                contextual_variable: 'mood',
                movies:
                    [
                        { movieId: 1, rating: 3, mood: "neutral", domEmo: "sad" } ,
                        { movieId: 1, rating: 5, mood: "neutral", domEmo: "sad" } ,
                        { movieId: 1, rating: 4, mood: "negative", domEmo: "sad" } ,
                        { movieId: 1, rating: 2, mood: "negative", domEmo: "sad" }
                    ]
            };
        });

        it('calculates the right t-mean metric', (done) => {
            let res = algorithm.t_mean(contextual_dataset, "mood");
            res.result.toFixed(2).should.be.eql('0.43');
            res.context.should.be.eql('mood');
            res.contextual_value.should.be.eql('neutral');
            done();
        })
    });

    describe('Run z_test criterion', function (){

        var contextual_dataset;
        before(() => {
            contextual_dataset =
            {
                contextual_variable: "mood",
                movies:
                    [
                        { movieId: 1, rating: 3, mood: "neutral", domEmo: "sad" } ,
                        { movieId: 1, rating: 5, mood: "neutral", domEmo: "sad" } ,
                        { movieId: 1, rating: 4, mood: "neutral", domEmo: "sad" } ,
                        { movieId: 1, rating: 2, mood: "neutral", domEmo: "sad" },
                        { movieId: 1, rating: 4, mood: "neutral", domEmo: "sad" } ,
                        { movieId: 1, rating: 5, mood: "positive", domEmo: "sad" } ,
                        { movieId: 1, rating: 4, mood: "negative", domEmo: "sad" }
                    ]
            };
        });

        it('calculates the right z-test metric', (done) => {
            let res = algorithm.z_test(contextual_dataset, "mood");
            res.result.should.be.equal(0);
            done();
        })
    });


     describe('Item splitting', function (){

         var movie;
         before(() => {
             movie = {
             'userId-1' : {'movieId':1,'rating':2,'mood':'neutral','domEmo':'positive'},
             'userId-2' : {'movieId':1,'rating':2,'mood':'neutral','domEmo':'positive'},
             'userId-3' : {'movieId':1,'rating':2,'mood':'negative','domEmo':'positive'}
             };
         });

         it('split a movie based on context', (done) => {
             let res = algorithm.split_movie(movie,'mood','neutral');
             res.split1.should.not.containEql({'mood':'neutral'});
             res.split2.should.not.containEql({'mood':'negative'});
             done();
         })
     });

});



