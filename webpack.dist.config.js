// This config is run to compile and export the production environment to the dist/ folder.
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Path = require('path');
const Webpack = require('webpack');

const options = {
  entry: {
    dist: [
      './app/React.tsx',
      './app/Style.scss',
      './node_modules/expedition-app/app/Style.scss',
    ],
    static: [
      './app/Style.scss',
      './node_modules/expedition-app/app/Style.scss',
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json', '.txt'],
  },
  output: {
    path: __dirname,
    filename: '[name]/bundle.js',
  },
  module: {
    loaders: [
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      // TODO this does not export images to static/ for maintenance pages,
      // but attempting to do so then breaks export to dist/
      // Will be auto-fixed when we migrate all static pages to quests.expedition
      // In the mean time, can manually copy images over when deploying static files
      { test: /\.(ttf|eot|svg|png|gif|jpe?g|woff(2)?)(\?[a-z0-9=&.]+)?$/, loader : 'file-loader?outputPath=dist/' },
      { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.tsx$/, loaders: ['awesome-typescript-loader'], exclude: /\/node_modules\/((?!expedition\-app).)*$/ },
      { enforce: 'post', test: /\.tsx$/, loaders: ['babel-loader'], exclude: /\/node_modules\/((?!expedition\-app).)*$/ },
    ],
  },
  plugins: [
    new Webpack.optimize.AggressiveMergingPlugin(),
    new Webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'API_HOST': JSON.stringify(process.env.API_HOST || 'https://api.expeditiongame.com'),
      },
    }),
    new CopyWebpackPlugin([
      // Copy ops for dist folder (main app)
      { from: 'app/index.html', to: 'dist' },
      { from: 'app/assets', to: 'dist' },
      { from: 'node_modules/expedition-app/app/images', to: 'dist/images' },
      { from: 'app/dictionaries', to: 'dist/dictionaries'},
      { from: 'app/scripts', to: 'dist/scripts' },

      // Copy ops for static folder (error/maintenance pages)
      { from: 'app/error.html', to: 'static' },
      { from: 'app/maintenance.html', to: 'static' },
      { from: 'app/assets', to: 'dist' },
      { from: 'node_modules/expedition-app/app/images', to: 'static/images' },
    ]),
    new Webpack.LoaderOptionsPlugin({ // This MUST go last to ensure proper test config
      options: {
        babel: {
          presets: ["es2015"],
          cacheDirectory: true,
        },
      },
    }),
  ],
};

module.exports = options;
