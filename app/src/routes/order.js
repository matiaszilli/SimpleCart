
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
        
        // if id does not exists
        if (!order)
            return res.status(500).json({
                ok: false,
                msj: 'Error, wrong id',
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

// Add Product to given Order
app.post('/:id/products', (req, res) => {
    var orderId = req.params.id;
    // parse body request
    var body = req.body;
    var newProduct = {
        _id: body.id,
        quantity: parseInt(body.quantity, 10)
    };
    Order
        .findById(orderId)
        .exec( (err, order) => {
            
        // if there was a error getting the Order
        if (err)
            return res.status(500).json({
                ok: false,
                msj: 'Error getting the order',
                errors: err
            });

        // decrement Product stock
        Product
            .findOneAndUpdate({ _id: newProduct._id }, { $inc: { stock: -newProduct.quantity } }, {new: true }, (err) => {
            // if there was a error getting the Order
            if (err)
                return res.status(400).json({
                    ok: false,
                    msj: 'Error updating Product stock',
                    errors: err
                });
        });

        // if the Order already has that product increment the quantity
        if(order.items.id(newProduct._id)){
            order.items.id(newProduct._id).quantity += newProduct.quantity
        } else { // if not, add it to items
            order.items.push(newProduct);
        }

        // save order
        order.save(
            (err, orderDB) => {
    
            // if there was a error
            if (err)
                return res.status(400).json({
                    ok: false,
                    msj: 'Error saving Order',
                    errors: err
                });
            
            // return updated order
            return res.json({
                ok: true,
                data: orderDB
            });
        });
    });
});

// Delete product to given Order
app.put('/:id/products', (req, res) => {
    var orderId = req.params.id;
    // parse body request
    var body = req.body;
    var deleteProduct = body.id;
    Order
        .findById(orderId)
        .exec( (err, order) => {
            
        // if there was a error getting the Order
        if (err)
            return res.status(500).json({
                ok: false,
                msj: 'Error getting the order',
                errors: err
            });


        // if the Product exists in the Order
        if(order.items.id(deleteProduct)){
            var oldQuantity = order.items.id(deleteProduct).quantity;
            order.items.id(deleteProduct).remove();
        } else { // if not, add it to items
            return res.status(500).json({
                ok: false,
                msj: 'Product does not exist in the order',
            });
        }

        // increment Product stock
        Product
        .findOneAndUpdate({ _id: deleteProduct }, { $inc: { stock: oldQuantity } }, {new: true }, (err) => {
        // if there was a error getting the Order
        if (err)
            return res.status(400).json({
                ok: false,
                msj: 'Error updating Product stock',
                errors: err
            });
        });

        // save order
        order.save(
            (err, orderDB) => {
    
            // if there was a error
            if (err)
                return res.status(400).json({
                    ok: false,
                    msj: 'Error saving Order',
                    errors: err
                });
            
            // return updated order
            return res.json({
                ok: true,
                data: orderDB
            });
        });
    });
});

// Checkout a Order
app.get('/:id/checkout', async (req, res) => {
    var orderId = req.params.id;
    
    try {
        order = await Order.findById(orderId);
        // items in the order
        let orderItems = order.items;
            
        order.total = 0;
        let itemId;
        let itemQuantity;
        let itemPrice;

        // iterate over each item in the Order
        for (const it of orderItems) {
            // get item (product) quantity
            itemId = it._id;
            itemQuantity = it.quantity;

            // get product price
            let prod = await Product.findById(itemId);
            itemPrice = prod.price;

            // accumulate to order total
            order.total += itemPrice * itemQuantity;
        };
        // update order status and total
        console.log('total ',order.total);
        order.status = 'Closed';

        // save order
        let orderDB = await order.save();

        // return updated order
        return res.json({
            ok: true,
            data: orderDB
        });

    } catch (err){
        return res.status(500).json({
            ok: false,
            msj: 'Error checking out',
            errors: err
        });
    }

});

module.exports = app;