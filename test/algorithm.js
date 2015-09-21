/**
 * Created by ugo on 18/09/15.
 */

var algorithm = require('../models/algorithm.js');
var should = require('should');
var request = require('supertest');

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
            algorithm.cosine_similarity(film1, film2).toFixed(2).should.equal('0.80');
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

});



