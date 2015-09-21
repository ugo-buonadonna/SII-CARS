/**
 * Created by ugo on 10/05/15.
 */
var math = require('mathjs');


function mean_normalize(ratings) {
    var mean = math.mean(rating);
    for(rating in ratings)
        if(ratings.hasOwnProperty(rating))
            rating -= mean;
    return ratings;
}




// Dato il dataset in ingresso, si costruisce la matrice users,items con i ratings
// Poi si normalizza secondo il rating medio di ogni utente.
// Si popola quindi ogni utente con la lista di item che ha ratato, e gli item
// Da quanti e quali utenti è stato ratato.
// Precond: User ratings have already been normalized by mean

function cosine_similarity(item1,item2) {
    var item1_ratings = item1.getRatings();
    var item2_ratings = item2.getRatings();
    var numerator = 0;
    var denominator = 0, sx_den = 0, dx_den = 0;
    var total;
    for (var i = 0; i < rating1.length; i++) {
        numerator += item1_ratings[i] * item2_ratings[i];
        sx_den += math.pow(item1_ratings[i], 2);
        dx_den += math.pow(item2_ratings[i], 2);
    }
    total = numerator / (math.sqrt(sx_den) * math.sqrt(dx_den));
    return total;
}



function predict(user,target_item) {
    var rated_items = user.getRatedMovies();
    var similarity,numerator = 0,denominator = 0;
    for( item in rated_items)   {
        similarity = cosine_similarity(target_item, item);
        numerator +=  similarity * item.getUserRating(user);
        denominator += similarity;
    }
    return numerator / denominator;
}
