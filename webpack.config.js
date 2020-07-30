const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill', './src/js/index.js'], //which file to bundle from
    output: {
        path: path.resolve(__dirname, 'dist'), //where to create bundle.js
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: './dist' //which folder to run local server from
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html', //name of file to be created in dist
            template: './src/index.html' //path of which file to copy realtime
        })
    ],
    module: { //for loaders like Babel
        rules: [
            {
                test: /\.js$/, //look for all files ending in js
                exclude: /node_modules/, //except for those in node_modules
                use: {
                    loader: 'babel-loader' //use this loader on them
                }
            }
        ]
    }
};