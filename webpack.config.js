var path = require('path');
var webpack = require('webpack');
var apiSetup = require('./src/api-setup.js');
var CompressionPlugin = require('compression-webpack-plugin');
var WebpackCleanPlugin = require('webpack-clean');
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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
					name: 'img/[name].[ext]?[hash]'
				}
			}, {
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'file-loader', // url-loader
				options: {
					limit: 10000,
					name: 'fonts/[name].[hash:7].[ext]'
				}
			}
		]
	},
	resolve: {
		alias: {
			vue$: 'vue/dist/vue.common.js',
			quasar: path.resolve(__dirname, 'node_modules/quasar-framework/'),
			src: path.resolve(__dirname, 'src'),
			vmix: path.resolve(__dirname, 'src/vue-mixins'),
			vcomp: path.resolve(__dirname, 'src/vue-components')
		}
	},
	devServer: {
		historyApiFallback: true,
		noInfo: false,
		contentBase: "www",
		// clearConsoleOnRebuild: false, // probably not works; remove for Quasar Play QR code
		setup: apiSetup // used also in _main-server.js
	},
	performance: {
		hints: false // 'error'
	},
	// https://webpack.github.io/docs/configuration.html#devtool
	devtool: '#cheap-module-eval-source-map', // faster than '#eval-source-map', 
	plugins: [
		new FriendlyErrorsWebpackPlugin(),
		new webpack.DefinePlugin({
			'__THEME': '"mat"' // TODO receive from arguments
		}),
	]
}

var bAnalyze = process.env.NODE_ENV === 'analyze';
if (process.env.NODE_ENV === 'production' || bAnalyze) { // http://vue-loader.vuejs.org/en/workflow/production.html
	conf_browser.devtool = '#source-map';
	conf_browser.plugins = conf_browser.plugins.concat([
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
			compress: {
				warnings: false,
				comparisons: false // workaround for https://github.com/mapbox/mapbox-gl-js/issues/4359
			}
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true
		}),
		/**
			Build-time compression
			https://github.com/webpack-contrib/compression-webpack-plugin
		*/
		new CompressionPlugin({
			asset: "[path]-compressed.gz[query]",
			algorithm: "gzip",
			test: /\.js$|\.css$|\.html$/,
			threshold: 10240,
			minRatio: 0.8
		}),
		/**
			This hack is for preventing moment.js from bloating the bundle with its locales
			alt solution is new webpack.IgnorePlugin(/(locale)/, /node_modules.+(momentjs)/)
			or just https://github.com/ksloan/moment-mini
			see also https://github.com/webpack/webpack/issues/3128
		*/
		new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/),
		/**
			This hack is for preventing Cordova exception about "duplicated" files which is js and js.gz
			deprecated: ive just added -compressed suffix to make filename different
			TODO delete WebpackCleanPlugin
		*/
		new WebpackCleanPlugin([
			// 'www/build-browser.js'
		])
		// TODO https://github.com/webpack-contrib/i18n-webpack-plugin
	])
}

if (bAnalyze) {
	conf_browser.plugins.push(new BundleAnalyzerPlugin({
		analyzerPort: 8111
	}))
}

module.exports = [conf_browser];