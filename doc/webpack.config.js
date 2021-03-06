const HardSourcePlugin  = require('hard-source-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var nodeExternals       = require('webpack-node-externals');

let client = {
	target: 'web',
	entry: ['babel-polyfill',__dirname+'/src/index.js'],
	output: {
		path: __dirname+'/public/js/',
		filename: 'bundle.js'
	},
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: /(node_modules)/,
				query: {
					presets: ['es2015', 'env', 'react', 'stage-0']
				}
			}
		]
	},
	plugins: [
		new HardSourcePlugin(),
		new BrowserSyncPlugin({
			host: 'localhost',
			port: 8000,
			server: {
				baseDir: __dirname+'/'
			}
		})
	],
	resolve: {
		alias: {
			DocContainers: __dirname+'/src/containers/',
			DocComponents: __dirname+'/src/components/',
			DocPages:      __dirname+'/src/pages/',
			Containers:    __dirname+'/../src/shared/containers/',
			Components:    __dirname+'/../src/shared/components/',
			Actions:       __dirname+'/../src/shared/actions/',
			Containers:    __dirname+'/../src/shared/containers/',
			Components:    __dirname+'/../src/shared/components/',
			Utils:         __dirname+'/../src/shared/utils',
			Shared:        __dirname+'/../src/shared/',
			Auth:          __dirname+'/../src/shared/auth/',
			Classes:       __dirname+'/../src/shared/classes/',
			Config:        __dirname+'/../src/shared/config/',
			Redux:         __dirname+'/../src/shared/redux/'
		}
	}
};

module.exports = client;
