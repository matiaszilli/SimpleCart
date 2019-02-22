
// Requires
var express = require('express');
var app = express();

var Product = require('../models/product'); // requires Product model
var Order = require('../models/order'); // requires Order model

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
app.get('/:id', (req, res, next) => {
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

        // if id does not exists
        if (!product)
            return res.status(500).json({
                ok: false,
                msj: 'Error, wrong id',
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

// Get Best Sellers
app.patch('/bestSeller', async (req, res) => {
    let bests = [];
    try {
        // get all orders
        orders = await Order.find({});
        
        // iterate over each Order
        for (const order of orders) {

            // if order is not 'Closed' continue
            if (order.status !== 'Closed') {
                continue;
            }

            let orderItems = order.items;
            // iterate over each item in the Order
            for (const orderItem of orderItems) {

                // if the product exist in the Best table then increment quantity
                let itemBestFound = bests.find( (itemBest) => itemBest._id.toString() === orderItem._id.toString());
                if (itemBestFound) {
                    itemBestFound.quantity += orderItem.quantity;
                } else { // if not, add it to bests
                    bests.push(orderItem);
                }

            }

        }

        // sort best array by quantity
        bests.sort((b,a) => (a.quantity > b.quantity) ? 1 : ((b.quantity > a.quantity) ? -1 : 0)); 

        // return best seller products
        return res.json({
            ok: true,
            data: bests
        });

    } catch (err) {
        return res.status(500).json({
            ok: false,
            msj: 'Error getting best sellers',
            errors: err
        });
    }
});

module.exports = app;