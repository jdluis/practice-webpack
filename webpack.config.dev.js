const path = require("path"); //modulo requerido
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require ('dotenv-webpack');

module.exports = {
  entry: "./src/index.js", //punto de entrada donde comenzara a generar
  output: {
    path: path.resolve(__dirname, "dist"), //ruta, normalmente dist
    filename: "[name].[contenthash].js", //nombre del archivo ya desplegado con webpack
    assetModuleFilename: 'assets/images/[hash][ext][query]' //con ello marcamos el poutput
  },
  mode: 'development',
  watch: true,
  resolve: {
    extensions: [".js"], //son las extensiones que usara webpack
    alias: {
      '@utils': path.resolve(__dirname, 'src/utils/'), //de esta manera creamos un alias de utils
      '@templates': path.resolve(__dirname, 'src/templates/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
      '@images': path.resolve(__dirname, 'src/assets/images/'),
    }
  },
  module: {
    rules: [
      {
        test: /\.m?js$/, //usa cualquier extension que sea mjs (m de modulos) o js
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(c|sc|sa)ss$/, //archivos con .css
        use: [
          MiniCssExtractPlugin.loader, //en este caso es un array, eso depende del modulo, plugin.
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.png/,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10000,
            minetype: "application/font-woff",
            name: "[name].[contenthash].[ext]", //[contenthash] se añade por la optimizacion
            outputPath: './assets/fonts',
            publicPath: '../assets/fonts/',
            esModule: false
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: "./public/index.html", //definimos donde esta nuestro archivo html
      filename: "./index.html", //no definimos con el nombre que queramos, por default index.js
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/[name].[contenthash].css' //para optimizar
    }),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "assets/images"),
          to: "assets/images",
        },
      ],
    }),
    new Dotenv()
  ],
};
