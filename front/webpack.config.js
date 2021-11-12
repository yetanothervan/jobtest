"use strict";

const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        bundle: "./src/index.tsx",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        modules: [
            'node_modules'
        ]
    },
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        path: __dirname + '/dist/',
        publicPath: '/'
    },
    devServer: {
        static: {
            directory: __dirname + '/public/',
        },
        historyApiFallback: true,
        hot: false,
        open: false,
        port: 3000
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + '/src/index.html',
            filename: 'index.html',
            inject: 'body'
        })
    ],
    module: {
        rules: [
            {
                test: /\.d.ts$/,
                loader: 'ignore-loader'
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
};