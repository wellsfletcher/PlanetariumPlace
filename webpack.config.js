var HTMLWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: __dirname + '/app/index.html',
    filename: 'index.html',
    inject: 'body',
    favicon: __dirname + "/assets/favicon.ico"
});


const CopyWebpackPlugin = require('copy-webpack-plugin');
var CopyWebpackPluginConfig = new CopyWebpackPlugin(
    {
        patterns: [
            {
                from: 'app/api',
                to: 'api',
                force: true
            },
            {
                from: 'app/assets',
                to: 'assets',
                force: true
            }
        ]
    }
);
module.exports = {
    entry: __dirname + '/app/index.js',
    mode: 'development',
    module: {
        rules: [
            /*{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },*/
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(tsx|ts)$/,
                // test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            },
            /*{
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },*/ {
                test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'transformed.js',
        path: __dirname + '/build'
    },
    plugins: [HTMLWebpackPluginConfig, CopyWebpackPluginConfig]
};
