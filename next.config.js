// next.config.js
const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const withImages = require('next-images');
const webpack = require('webpack');
require('dotenv').config();

const { compose } = require('redux');

const enhanceApp = compose(
  withSass,
  withCSS,
  withImages,
);

module.exports = enhanceApp({
  webpack(config, options) {
    config.module.rules.unshift({
      test: /\.component.svg$/,
      use: ['@svgr/webpack'],
    });
    const env = Object.keys(process.env).reduce((acc, curr) => {
      acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
      return acc;
    }, {});

    config.plugins.push(new webpack.DefinePlugin(env));
    // console.log('config', config);
    return config;
  },
  distDir: '../build',
  poweredByHeader: false,
  exclude: /\.component.svg$/,
});

// module.exports = withCSS({
//   /* config options here */
// });
