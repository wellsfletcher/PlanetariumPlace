const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

console.debug = () => {};

module.exports = merge(common, {
    mode: 'production',
});