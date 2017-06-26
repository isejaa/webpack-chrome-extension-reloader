const webpack = require("webpack");
const path = require("path");
const pack = require("./package.json");

const { production, development, test } = ["production", "development", "test"].reduce((acc, env) => {
  acc[env] = (val) => process.env.NODE_ENV === env ? val : null;
  return acc;
}, {});

module.exports = {
  target: "node",
  entry: test({
    "tests": "./specs/index.specs.ts"
  }) || { "webpack-chrome-extension-reloader": "./src/index.ts" },
  devtool: production("source-map") || development("source-map") || test("inline-source-map"),
  output: {
    publicPath: ".",
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
    libraryTarget: "umd"

  },
  plugins: [
    production(new webpack.optimize.UglifyJsPlugin({sourceMap: true}))
  ].filter((plugin) => !!plugin),
  externals: [Object.keys(pack.dependencies)],
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    mainFiles: ["index"],
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [{
      enforce: "pre",
      test: /\.js$/,
      loader: "source-map-loader"
    }, {
      enforce: "pre",
      test: /\.tsx?$/,
      loaders: [{ loader: "source-map-loader" }, { loader: "tslint-loader", options: { configFile: "./tslint.json" } }]
    }, {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loaders: ["babel-loader"],
    }, {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      loaders: ["babel-loader", "ts-loader"],
    }, {
      test: /\.json$/,
      exclude: /node_modules/,
      loaders: ["json-loader"]
    }, {
      test: /\.txt$/,
      exclude: /node_modules/,
      loaders: ["raw-loader"]
    }]
  }
};