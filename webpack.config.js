const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    hot: true,
    compress: true,
    host: "localhost",
    port: 8080,
    contentBase: path.resolve(__dirname, "./dist"),
    proxy: {
      '/api': 'http://localhost:80'
    }
  },
  module: {
    rules: [
      {
        // For our normal typescript
        test: /\.ts?|.tsx?$/,
        use: [
          {
            loader: "ts-loader"
          }
        ],
        exclude: /(?:node_modules)/
      }
    ]
  },
  resolve: {
    modules: ["src", "node_modules"],
    extensions: [".js", ".ts", ".tsx"]
  }
};
