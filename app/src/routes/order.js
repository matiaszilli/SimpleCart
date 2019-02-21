
// Requires
var express = require('express');
var app = express();

var Product = require('../models/order'); // requires Product model

// Get all Orders
app.get('/', (req, res) => {
    Product
        .find({})
        .exec( (err, product) => {
        
        // if there was a error
        if (err)
            return res.status(500).json({
                ok: false,
                msj: 'Error getting products',
                errors: err
            });

        // return a product list
        return res.json({
            ok: true,
            data: product
        });
    });
});


module.exports = app;