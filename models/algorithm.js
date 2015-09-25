/**
 * Created by ugo on 10/05/15.
 */
'use strict';
var math = require('mathjs');

/*
* Valutare di rendere costanti le soglie dei criteri
*/


class algorithm {

    static informaton_gain(i, s) {

    }

    static t_mean_parameters(ratings) {

        var ratings_mean = math.mean(ratings);
        var total_ratings = ratings.length();
        var sum =  0;
        var variance = 0;
        var parameters = {};

        ratings.forEach(function(elem){

            sum += [(elem - ratings_mean) * (elem - ratings_mean)]
        });

        variance = sum/total_ratings;

        parameters = {

            mean: ratings_mean,
            s: variance,
            n: total_ratings
        };

        return parameters;
    }

    /*
    * context_dataset = { 
                            contextual_variable: "mood", 
                            movies: "array of movies object"
                        }
    *
    * context2movies = {
            "neutral": "array of movies  with mood neutral",
            ......
    }
    * contextual_parameter --> il tipo di contesto che stiamo considerando nell'iterazione
    *
    * parameters2context = { "negative": "parametri per calcolare il t_mean per mood = negative ( per esempio )"}
    */
    static t_mean(context_dataset, contextual_parameter, threshold){

        var contextual_variable = context_dataset.contextual_variable;
        var movies = context_dataset.movies;
        var context2movies = {};
        var parameters2context = {};

        var t_mean_numerator = 0;
        var t_mean_denominator = 0;
        var t_mean_result = 0;

        /* Associo ogni movie al valore specifico del parametro di contesto 
        * preso in esame ( contextual_parameter)
        */
        movies.forEach(function(elem){

            var movie = JSON.parse(elem);
            var contextual_value = movie[contextual_parameter];

            if(!context2movies.hasOwnProperty(contextual_value)){

                context2movies[contextual_value] = [];
            }

            context2movies[contextual_value].push(elem);
        });

        /* Costruisco tutti i parametri necessari per poi applicare la formula
        * del t_mean
        */
        for(var key in context2movies){

            var movies_context = context2movies[key];
            var ratings = [];

            movies_context.forEach(function(elem){

                ratings.push(elem.rating);
            });

            parameters2context.key = t_mean_parameters(ratings);
        }


        /* Calcolo del numeratore e del denominatore del t_mean 
        *
        */
        for(var key2 in parameters2context){

            var mean = parameters2context[key2].mean;
            var s = parameters2context[key2].s;
            var n = parameters2context[key2].n;

            t_mean_numerator = mean - t_mean_numerator;
            t_mean_denominator += s/n;
        } 

        t_mean_result = math.abs(t_mean_numerator / math.sqrt(t_mean_denominator));

        return t_mean_result;
    }

    static z_test(i, s) {

    }

    static impurities_criterion(i, s) {

    }

    static mean_normalize(ratings) {
        var mean = math.mean(ratings);
        var result = [];
        for(let i=0; i < ratings.length; i++)
            result[i] = (ratings[i] - mean);
        return result;
    }

    static cosine_similarity(item1,item2) {
        //var item1_ratings = item1.getRatings();
        //var item2_ratings = item2.getRatings();
        var item1_ratings = item1;
        var item2_ratings = item2;
        var numerator = 0;
        var denominator = 0, sx_den = 0, dx_den = 0;
        var total;
        for (var i = 0; i < math.min(item1_ratings.length,item2_ratings.length) ; i++) {
            numerator += item1_ratings[i] * item2_ratings[i];
            sx_den += math.pow(item1_ratings[i], 2);
            dx_den += math.pow(item2_ratings[i], 2);
        }
        total = numerator / (math.sqrt(sx_den) * math.sqrt(dx_den));
        return total;
    }

    static predict(user,target_item) {
        var rated_items = user.getRatedItems();
        var similarity,numerator = 0,denominator = 0;
        for( var i=0; i<rated_items.length; i++)   {
            similarity = cosine_similarity(target_item, rated_items[i]);
            numerator +=  similarity * item.getRating(user);
            denominator += similarity;
        }
        return numerator / denominator;
    }
};

module.exports = algorithm;
