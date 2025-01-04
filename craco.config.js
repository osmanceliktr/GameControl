module.exports = {
  webpack: {
    configure: {
      module: {
        rules: [
          {
            test: /\.xml$/,
            loader: 'xml-loader'
          }
        ]
      }
    }
  }
}; 