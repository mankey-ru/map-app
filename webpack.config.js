var path = require('path');
var webpack = require('webpack');
var apiSetup = require('./src/api-setup.js');
var CompressionPlugin = require('compression-webpack-plugin');
var WebpackCleanPlugin = require('webpack-clean');

var conf_browser = {
	// I used babel-regenerator-runtime instead of bundle babel-polyfill
	// because right now I dont need all polyfills
	// http://stackoverflow.com/a/36590887
	entry: [ /*'babel-regenerator-runtime',*/ './src/_main-browser.js'],
	output: {
		path: path.resolve(__dirname, './www/'),
		publicPath: '', // ахтунг! это путь не на ФС, а из урла. Если он кривой, не открывается сокет-коннект (см. консоль) и следовательно не работает HMR
		filename: 'build-browser.js'
	},
	module: {
		rules: [{
			test: /\.css$/,
			loader: "style-loader!css-loader"
		}, 
		// https://github.com/vuejs/vue-loader/blob/master/docs/en/options.md
		{
			test: /\.vue$/,
			loader: 'vue-loader',
			options: {
				loaders: {}
			}
		}, {
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: /node_modules/
		}, {
			test: /\.(png|jpg|gif|svg)$/,
			loader: 'file-loader',
			options: {
				name: '[name].[ext]?[hash]'
			}
		}
		/*
		Loader for SCSS|SASS
		https://github.com/webpack-contrib/sass-loader
		npm install sass-loader --save-dev
		,{
			test: /\.scss$/,
			use: [{
				loader: "style-loader" // creates style nodes from JS strings
			}, {
				loader: "css-loader" // translates CSS into CommonJS
			}, {
				loader: "sass-loader" // compiles Sass to CSS
			}]
		}*/ ]
	},
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.common.js'
		}
	},
	devServer: {
		historyApiFallback: true,
		noInfo: false,
		contentBase: "www",
		setup: apiSetup // used also in _main-server.js
	},
	performance: {
		hints: false // 'error'
	},
	// https://webpack.github.io/docs/configuration.html#devtool
	devtool: '#eval-source-map'
}

// http://vue-loader.vuejs.org/en/workflow/production.html
if (process.env.NODE_ENV === 'production') {
	conf_browser.devtool = '#source-map';
	conf_browser.plugins = (conf_browser.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
			compress: {
				warnings: false
			}
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true
		}),
		// https://github.com/webpack-contrib/compression-webpack-plugin
		new CompressionPlugin({
			asset: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.js$|\.css$|\.html$/,
			threshold: 10240,
			minRatio: 0.8
		}),

		new WebpackCleanPlugin([
			// deleting js result after gzip
			// because of cordova's «Execution failed for task ':mergeDebugAssets'»
			// js and js.gz looks like duplicated for cordova
            'www/build-browser.js' 
        ])
		// TODO https://github.com/webpack-contrib/i18n-webpack-plugin
	])
}

module.exports = [conf_browser];