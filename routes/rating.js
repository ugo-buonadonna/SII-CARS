module.exports = function(app) {
  // Module dependencies.
  var mongoose = require('mongoose'),
      Rating = mongoose.models.Rating,
      api = {};

  // ALL
  api.ratings = function (req, res) {
    Rating.find(function(err, ratings) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({ratings: ratings});
      }
    });
  };

  // GET
  api.rating = function (req, res) {
    var id = req.params.id;
    Rating.findOne({ '_id': id }, function(err, rating) {
      if (err) {
        res.status(404).json(err);
      } else {
        res.status(200).json({rating: rating});
      }
    });
  };

  // POST
  api.addRating = function (req, res) {

    var rating;

    if(typeof req.body.rating == 'undefined'){
      res.status(500).json({message: 'rating is undefined'});
    }

    rating = new Rating(req.body.rating);

    rating.save(function (err) {
      if (!err) {
        console.log("created rating");
        return res.status(201).json(rating.toObject());
      } else {
        return res.status(500).json(err);
      }
    });

  };

  // PUT
  api.editRating = function (req, res) {
    var id = req.params.id;

    Rating.findById(id, function (err, rating) {


    
      if(typeof req.body.rating["User_id"] != 'undefined'){
        rating["User_id"] = req.body.rating["User_id"];
      }
    
      if(typeof req.body.rating["Item_id"] != 'undefined'){
        rating["Item_id"] = req.body.rating["Item_id"];
      }
    
      if(typeof req.body.rating["Rating"] != 'undefined'){
        rating["Rating"] = req.body.rating["Rating"];
      }
    
      if(typeof req.body.rating["Timestamp"] != 'undefined'){
        rating["Timestamp"] = req.body.rating["Timestamp"];
      }
    

      return rating.save(function (err) {
        if (!err) {
          console.log("updated rating");
          return res.status(200).json(rating.toObject());
        } else {
         return res.status(500).json(err);
        }
        return res.status(200).json(rating);
      });
    });

  };

  // DELETE
  api.deleteRating = function (req, res) {
    var id = req.params.id;
    return Rating.findById(id, function (err, rating) {
      return rating.remove(function (err) {
        if (!err) {
          console.log("removed rating");
          return res.status(204).send();
        } else {
          console.log(err);
          return res.status(500).json(err);
        }
      });
    });

  };


  app.get('/api/ratings', api.ratings);
  app.get('/api/rating/:id', api.rating);
  app.post('/api/rating', api.addRating);
  app.put('/api/rating/:id', api.editRating);
  app.delete('/api/rating/:id', api.deleteRating);
};
