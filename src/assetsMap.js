// Map movie/product ids or lowercase titles to local image assets (require)
// Add your local asset mappings here. Keys can be numeric ids or lowercase title strings.

export default {
  // Map product/movie ids 1..10 to local placeholder assets (used when no TMDB poster available)
  // Map ids 1..10 to local movie poster assets in assets/movies/
  1: require('../assets/movies/inception.jpg'),
  2: require('../assets/movies/the_dark_knight.jpg'),
  3: require('../assets/movies/interstellar.jpg'),
  4: require('../assets/movies/parasite.jpg'),
  5: require('../assets/movies/tenet.jpg'),
  6: require('../assets/movies/avengers_endgame.jpg'),
  7: require('../assets/movies/joker.jpg'),
  8: require('../assets/movies/shawshank_redemption.jpg'),
  9: require('../assets/movies/the_matrix.jpg'),
  10: require('../assets/movies/cars.jpg'),

  // Title-based mappings (lowercase) to the same poster files
  'inception': require('../assets/movies/inception.jpg'),
  'the dark knight': require('../assets/movies/the_dark_knight.jpg'),
  'interstellar': require('../assets/movies/interstellar.jpg'),
  'parasite': require('../assets/movies/parasite.jpg'),
  'tenet': require('../assets/movies/tenet.jpg'),
  'avengers: endgame': require('../assets/movies/avengers_endgame.jpg'),
  'joker': require('../assets/movies/joker.jpg'),
  'the shawshank redemption': require('../assets/movies/shawshank_redemption.jpg'),
  'the matrix': require('../assets/movies/the_matrix.jpg'),
  'pulp fiction': require('../assets/movies/cars.jpg'),
};
