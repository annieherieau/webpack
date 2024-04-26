if (process.env.NODE_ENV === 'production') {
  module.exports = {
    plugins: [
      require('autoprefixer'),
      require('cssnano'),
      // Tous les modules PostCSS que tu souhaites
      // https://github.com/postcss/postcss 
    ],
  };
}