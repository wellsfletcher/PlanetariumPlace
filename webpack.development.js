const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map', // TODO: figure out what this option does
    // devServer: {
    //     client: {
    //         logging: 'info',
    //         overlay: true,
    //     },
    //     compress: true,
    //     open: true,
    //     static: './build',
    // },
    stats: { // TODO: figure out what this option does
        errorDetails: true,
    },
});