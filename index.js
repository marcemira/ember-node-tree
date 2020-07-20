'use strict';

const env = process.env.EMBER_ENV;
const isProduction = ['production'].includes(env);

module.exports = {
  name: require('./package').name,

  options: {
    sourcemaps: {
      enabled: true,
      extensions: ['js', 'scss'],
    },

    minifyCSS: {
      enabled: isProduction,
    },

    minifyJS: {
      enabled: isProduction,
    },

    cssModules: {
      extension: 'module.scss',
      intermediateOutputPath: 'addon/styles/modules.scss',
    },
  },

  isDevelopingAddon: function () {
    return true;
  },
};
