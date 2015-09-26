var request = require('supertest'),
    express = require('express');

process.env.NODE_ENV = 'test';

var app = require('../../app.js');
var _id = '';


describe('POST New Rating', function(){
  it('creates new rating and responds with json success message', function(done){
    request(app)
    .post('/api/rating')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({"rating": {}})
    .expect(201)
    .end(function(err, res) {
      if (err) {
        throw err;
      }
      _id = res.body._id;
      done();
    });
  });
});

describe('GET List of Ratings', function(){
  it('responds with a list of rating items in JSON', function(done){
    request(app)
    .get('/api/ratings')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});

describe('GET Rating by ID', function(){
  it('responds with a single rating item in JSON', function(done){
    request(app)
    .get('/api/rating/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
  });
});


describe('PUT Rating by ID', function(){
  it('updates rating item in return JSON', function(done){
    request(app)
    .put('/api/rating/'+ _id )
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .send({ "rating": { "title": "Hell Is Where There Are No Robots" } })
    .expect(200, done);
  });
});

describe('DELETE Rating by ID', function(){
  it('should delete rating and return 200 status code', function(done){
    request(app)
    .del('/api/rating/'+ _id)
    .expect(204, done);
  });
});
