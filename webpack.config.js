const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

let mode = "development";

if (process.env.NODE_ENV === "production") mode = "production";

module.exports = {
	mode,
	target: "web",

	output: {
		path: path.resolve(__dirname, "dist"),
		assetModuleFilename: "images/[hash][ext][query]",
	},

	module: {
		rules: [
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				type: "asset",
			},
			{
				test: /\.(s[ac]|c)ss$/i,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: { publicPath: "" },
					},
					"css-loader",
					"sass-loader",
				],
			},
			{
				test: /\.js$/i,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: "file-loader",
						options: {
							name: "[name].[ext]",
							outputPath: "./src/fonts/",
						},
					},
				],
			},
		],
	},

	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin(),
		new HtmlWebpackPlugin({
			template: "./src/index.html",
		}),
	],

	devtool: "source-map",
	devServer: {
		contentBase: "./dist",
		hot: true,
	},
};
