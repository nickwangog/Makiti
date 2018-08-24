const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

require('dotenv').config()

module.exports = {
	context: path.join(__dirname, 'src'),
	entry: './index.js',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: './bundle.js',
		publicPath: '/'
	},
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				loader: ['style-loader', 'css-loader', 'postcss-loader'],
			},
			{
				test: /\.(png|jpeg|jpg)$/,
				loader: 'file-loader',
			}
		]
	},
	devServer: {
		historyApiFallback: true, // If server receives a 'not found' request, it will redirect to index.html
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'index.html',
			inject: 'body'
		}),
		new webpack.DefinePlugin({
			ACCOUNT_SERVICE: JSON.stringify(process.env.ACCOUNT_SERVICE),
			APPLICATION_SERVICE: JSON.stringify(process.env.APPLICATION_SERVICE),
			APP_REQUEST_SERVICE: JSON.stringify(process.env.APP_REQUEST_SERVICE),
			CAR_REGISTRATION_SERVICE: JSON.stringify(process.env.CAR_REGISTRATION_SERVICE)
		})
	],
}
