import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const common = {
	mode: 'production',
	target: ['web', 'es5'],
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
		],
	},
	output: {
		path: path.resolve(__dirname, './dist'),
	},
	optimization: {
		minimize: false,
	},
}

export default [
	{
		...common,
		entry: 'window-onerror-handler',
		output: {
			...common.output,
			filename: 'woh.js',
		},
	},
	{
		...common,
		entry: './test/index.js',
		output: {
			...common.output,
			filename: 'index.[contenthash].js',
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: './test/index.html',
				filename: 'index.html',
			}),
		],
	},
	{
		...common,
		entry: './test/interactive.js',
		output: {
			...common.output,
			filename: 'interactive.[contenthash].js',
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: './test/interactive.html',
				filename: 'interactive.html',
			}),
		],
	},
]
