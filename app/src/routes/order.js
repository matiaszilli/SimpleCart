
// Requires
var express = require('express');
var app = express();

var Order = require('../models/order'); // requires Order model
var Product = require('../models/product'); // requires Product model

// Get all Orders
app.get('/', (req, res) => {
    Order
        .find({})
        .exec( (err, order) => {
        
        // if there was a error
        if (err)
            return res.status(500).json({
                ok: false,
                msj: 'Error getting orders',
                errors: err
            });

        // return a order list
        return res.json({
            ok: true,
            data: order
        });
    });
});

// Create a Order
app.post('/', (req, res) => {
    // parse body request
    var body = req.body;
    // create a new Order
    var order = new Order({
    });
    // save created Order
    order.save(
        (err, orderDB) => {

        // if there was a error
        if (err)
            return res.status(400).json({
                ok: false,
                msj: 'Error creating Order',
                errors: err
            });
    
        // return created order
        return res.json({
            ok: true,
            data: orderDB
        });
    });
});

// Get a Order by id
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Order
        .findById(id)
        .exec( (err, order) => {
            
        // if there was a error
        if (err)
            return res.status(500).json({
                ok: false,
                msj: 'Error getting the order',
                errors: err
            });

        // return a given order
        return res.json({
            ok: true,
            data: order
        });
    });
});

// Delete a Order
app.delete('/:id', (req, res) => {
    var id = req.params.id;
    Order
        .findByIdAndRemove(id, (err, orderDeleted) => {

        // if there was a error
        if (err)
            return res.status(400).json({
                ok: false,
                msj: 'Error deleting',
                errors: err
            });

        // if given product id does not exists 
        if (!orderDeleted)
            return res.status(400).json({
                ok: false,
                msj: 'Given Order id does not exists',
            });

        // return deleted product
        return res.json({
            ok: true,
            data: orderDeleted
        });
    });
});




module.exports = app;