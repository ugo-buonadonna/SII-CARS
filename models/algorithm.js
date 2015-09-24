/**
 * Created by ugo on 10/05/15.
 */
'use strict';
var math = require('mathjs');





class algorithm {

    static informaton_gain(i, s) {

    }

    static t_test(i, s) {

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
