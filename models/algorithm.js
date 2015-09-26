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
        var total_ratings = ratings.length;
        var sum =  0;
        var variance = 0;
        var parameters = {};

        ratings.forEach(function(elem){

            sum += [(elem - ratings_mean) * (elem - ratings_mean)]
        });

        variance = sum/total_ratings;

        parameters = {

            u_ic: ratings_mean,
            s_ic: variance,
            n_ic: total_ratings
        };

        return parameters;
    }

    /*
    * context_dataset = {
                            contextual_variable: "mood",
                            movies: "array of movies object with specific id"
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
    static t_mean(context_dataset, contextual_parameter){

        //var contextual_variable = context_dataset.contextual_variable;
        var movies = context_dataset.movies;
        var context2movies = {};
        var parameters2context = {};

        var t_mean_numerator = 0;
        var t_mean_denominator = 0;
        var t_mean_result = {};
        var temp_result = 0;

        t_mean_result = {

            result: 0,
            context: contextual_parameter,
            contextual_value: "" 
        };

        /*
        * Associo ogni movie al valore specifico del parametro di contesto
        * preso in esame ( contextual_parameter)
        */
        movies.forEach(function(elem){

            //var movie = JSON.parse(elem);
            var movie = elem;
            var contextual_value = movie[contextual_parameter];

            if(!context2movies.hasOwnProperty(contextual_value)){

                context2movies[contextual_value] = [];
            }

            context2movies[contextual_value].push(elem);
        });

        /*
        * Costruisco tutti i parametri necessari per poi applicare la formula
        * del t_mean
        */
        for(var key in context2movies){

            var movies_context = context2movies[key];
            var ratings = [];

            movies_context.forEach(function(elem){

                ratings.push(elem.rating);
            });

            parameters2context[key] = this.t_mean_parameters(ratings);
        }


        /*
        * Calcolo del numeratore e del denominatore del t_mean
        */
        for(var key2 in parameters2context){

            var u_ic = parameters2context[key2].u_ic;
            var s_ic = parameters2context[key2].s_ic;
            var n_ic = parameters2context[key2].n_ic;

            var u_rec_ic = ??????;
            var s_rec_ic = ??????;
            var n_rec_ic = ??????;

            t_mean_numerator = u_ic - u_rec_ic;
            t_mean_denominator = (s_ic / n_ic) + (s_rec_ic / n_rec_ic );
            temp_result = math.abs(t_mean_numerator / math.sqrt(t_mean_denominator));

            if( temp_result > t_mean_result.result ){

                t_mean_result.result = temp_result;
                t_mean_result.context = contextual_parameter;
                t_mean_result.contextual_value = key2;
            }
        }

        return t_mean_result;
    }

    static z_test(context_dataset, contextual_parameter) {

        var n_tot = context_dataset.movies.length;
        var movies = context_dataset.movies;
        var context2movies = {};
        var p_tot = 0;

        movies.forEach(function(elem){

            var movie = elem;
            var contextual_value = movie[contextual_parameter];
            //var movie = JSON.parse(elem);

            if(!context2movies.hasOwnProperty(contextual_value)){

                context2movies[contextual_value] = [];
            }

            context2movies[contextual_value].push(movie);

            if(parseInt(movie.rating) > 3){

                    p_tot += 1;
            }

            /*
            * A questo punto ho sia la mappa creata (contex2movies), che il numero notale di ratings high,
            * cioè maggiori di 3 memorizzati in p_tot
            */
        });

        for(var key in context2movies){


            console.log("[DEBUG] Iteration with key --> " + key + " and context --> " + contextual_parameter );

            var ratings = context2movies[key];
            var n_context_ratings = ratings.length;
            // a questo punto io ho tutti i rating del film memorizzati in n_tot ed ora ho anche tutti i ratings
            // di quel film per uno specifico valore del contesto memorizzati in n_context_ratings

            var n_ic = n_context_ratings;
            var n_rec_ic = n_tot - n_ic;

            /* Calcolo di quanti ratings sono high per lo specifico valore del parametro di contesto */
            var p_ic = 0;
            var p_rec_ic = 0;
            var z_test_numerator = 0;
            var z_test_denominator = 0;
            var z_test_result = {};
            var temp_result = 0;

            z_test_result = {

                result: 0,
                context: contextual_parameter,
                contextual_value: ""
            }

            ratings.forEach(function(elem){

                //var movie = JSON.parse(elem);
                var movie = elem;

                if(parseInt(movie.rating) > 3){

                    p_ic += 1;
                }
            });

            p_rec_ic = p_tot - p_ic;
            console.log("p_tot --> " + p_tot  + "\np_ic --> " + p_ic + "\np_rec_ic --> " + p_rec_ic + "\nn_ic --> " + n_ic + "\nn_rec_ic --> " + n_rec_ic);

            /*
            * A questo punto ho i valori dei ratings high del movie fissato un valore del parametro di contesto, memorizzati in p_ic
            * In piu' ho quanti sono i ratings high restanti, memorizzati in p_rec_ic
            */

            var p = ((p_ic * n_ic) + (p_rec_ic * n_rec_ic)) / (n_ic + n_rec_ic);
            console.log("p --> " + p);
            var sqrt_arg = (p * ( 1 - p ) * ( 1/n_ic + 1/n_rec_ic));

            z_test_numerator = p_ic - p_rec_ic;
            z_test_denominator = math.sqrt(sqrt_arg);

            console.log("z_test_numerator --> " + z_test_numerator);
            console.log("z_test_denominator --> " + z_test_denominator);

            temp_result = z_test_numerator / z_test_denominator;

            console.log("temp_result --> " + sqrt_arg  );
            console.log("\n\n");

            if( temp_result > z_test_result.result ){

                z_test_result.result = temp_result;
                z_test_result.context = contextual_parameter;
                z_test_result.contextual_value = key;
            }
        }

        return z_test_result;
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
