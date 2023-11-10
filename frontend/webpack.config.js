const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif|woff|woff2)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
        ]
    },
    externalsType: 'script',
    externals: {
        ymaps3: [
            `promise new Promise((resolve) => {
          if (typeof ymaps3 !== 'undefined') {
            return ymaps3.ready.then(() => resolve(ymaps3));
          }

          const script = document.createElement('script');
          script.src = "https://api-maps.yandex.ru/v3/?apikey=64208350-d10a-4647-be21-fa71ba6c2a85&lang=ru_RU";
          script.onload = () => {
            ymaps3.ready.then(() => resolve(ymaps3));
          };
          document.body.appendChild(script);
        })`
        ]
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new CleanWebpackPlugin(),
    ],
        devServer: {
    historyApiFallback: true,
        hot: true
},
};