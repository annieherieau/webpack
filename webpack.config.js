"use strict";
// Webpack utilise ce module Node.js pour travailler avec les dossiers.
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");
// plugin qui génère le bundle.css
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// plus de plugins : https://webpack.js.org/awesome-webpack/
const Dotenv = require('dotenv-webpack');

// Ceci est la configuration principale de ton projet.
// Ici, tu peux écrire les différentes options que tu souhaites, et dire à Webpack quoi faire.
module.exports = (env) => {
  console.log('NODE_ENV: ', env.NODE_ENV);
  return {
    // watch mode: Webpack can watch files and recompile whenever they change
    // https://webpack.js.org/configuration/watch/
    watch: true,
    watchOptions: {
      poll: 1000, // Check for changes every second
      ignored: /node_modules/,
    },
  
    // Ceci est le chemin vers le "point d'entrée" de ton app.
    // C'est depuis ce fichier que Webpack commencera à travailler.
    entry: "./src/js/index.js",
  
    // C'est ici qu'on dit à Webpack où mettre le fichier résultant avec tout ton JS.
    output: {
      // Le chemin relatif au dossier courant (la racine du projet)
      path: path.resolve(__dirname, "dist"),
      // Le nom du fichier de ton bundle JS
      filename: "bundle.js",
      // L'URL relatif au HTML pour accéder aux assets de l'application. Ici,
      // le HTML est situé à la racine du projet, donc on met une chaîne vide.
      publicPath: "",
    },
  
    // comment Webpack doit transformer nos fichiers
    module: {
      rules: [
        // pour le JS
        // utiliser de l'ES6 partout, et le transformer dans un langage plus ancien (Babel)
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        // pour le SASS : générer le fichier bundle.css
        {
          test: /\.(sa|sc|c)ss$/, // On applique notre règle aux fichiers .sass, .scss et .cs
          use: [
            // Attention, les loaders sont ajoutés en sens inverse !!
            // Donc celui-ci arrive en fin de chaîne :
            {
              // le fichier bundle.css est créé après toutes les modifs
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: "css-loader", // Ce loader permet d'utiliser url() et @import dans ton CSS
            },
            {
              // Ensuite on utilise le loader de postCSS, qui ajoutera un minifier par exemple,
              // ou bien un préfixeur automatique des règles CSS (--moz par exemple)
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [autoprefixer],
                },
              },
            },
            {
              // En premier, on transforme le SASS en CSS :
              loader: "sass-loader",
              options: {
                implementation: require("sass"),
              },
            },
          ],
        },
        // gestion des images
        {
          test: /\.(png|jpe?g|gif)$/i,
          type: "asset/resource",
        },
        // SVG
        {
          mimetype: "image/svg+xml",
          scheme: "data",
          type: "asset/resource",
          generator: {
            filename: "icons/[hash].svg",
          },
        },
        // gestion des fonts
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
        },
      ],
    },
  
    // plugins installés
    plugins: [
      new HtmlWebpackPlugin({ template: "./index.html" }),
      new MiniCssExtractPlugin({
        filename: "bundle.css",
      }),
      new Dotenv(),
    ],
  
    // Par défaut, le mode de Webpack est "production". En fonction de ce qui est
    // écrit ici, tu pourras appliquer différentes méthodes dans ton bundle final.
    // Pour le moment, nous avons besoin du mode "développement", car nous n'avons,
    // par exemple, pas besoin de minifier notre code.
    mode: "development",
  };
  
}