const path = require('path');

module.exports = {
  mode: 'development', // или 'production' в зависимости от ваших нужд
  entry: './src/index.js', // точка входа вашего приложения
  output: {
    filename: 'bundle.js', // имя выходного файла
    path: path.resolve(__dirname, 'dist') // каталог для выходных файлов
  },
  resolve: {
    fallback: {
      "util": require.resolve("util/"),
      "path": require.resolve("path-browserify"),
      // добавьте другие полифиллы по необходимости
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/, // правило для обработки JavaScript файлов
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // используемый лоадер
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'] // пресеты Babel
          }
        }
      }
    ]
  }
};
