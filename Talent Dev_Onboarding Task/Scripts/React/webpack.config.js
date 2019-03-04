module.exports = {
    mode: 'development',
    context: __dirname,
    entry: {
        home: "./Index.jsx",
        product: "./Component/Product.jsx",
        customer: "./Component/Customer.jsx",
        store: "./Component/Store.jsx",
        sale: "./Component/Sale.jsx"
    },
    output: {
        path: __dirname + "/dist",
        filename: "[name].bundle.js"
    },
    watch: true,
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/env', '@babel/react']
                }
            }
        }]
    }
};

