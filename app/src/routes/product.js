
// Requires
var express = require('express');
var app = express();

var Product = require('../models/product'); // requires Product model

// Get all Products
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

// Get a Product by id
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Product
        .findById(id)
        .exec( (err, product) => {
            
        // if there was a error
        if (err)
            return res.status(500).json({
                ok: false,
                msj: 'Error getting the product',
                errors: err
            });

        // return a given product
        return res.json({
            ok: true,
            data: product
        });
    });
});

// Create a Product
app.post('/', (req, res) => {
    // parse body request
    var body = req.body;
    // create a new Product
    var product = new Product({
        title: body.title,
        description: body.description,
        price: body.price,
        stock: body.stock,
    });
    // save created product
    product.save(
        (err, productDB) => {

        // if there was a error
        if (err)
            return res.status(400).json({
                ok: false,
                msj: 'Error creating Product',
                errors: err
            });
    
        // return created product
        return res.json({
            ok: true,
            data: productDB
        });
    });
});

// Delete a Product
app.delete('/:id', (req, res) => {
    var id = req.params.id;
    Product
        .findByIdAndRemove(id, (err, productDeleted) => {

        // if there was a error
        if (err)
            return res.status(400).json({
                ok: false,
                msj: 'Error deleting',
                errors: err
            });

        // if given product id does not exists 
        if (!productDeleted)
            return res.status(400).json({
                ok: false,
                msj: 'Given Product id does not exists',
            });

        // return deleted product
        return res.json({
            ok: true,
            data: productDeleted
        });
    });
});


module.exports = app;