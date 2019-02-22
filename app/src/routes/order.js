
// Requires
var express = require('express');
var app = express();

var Order = require('../models/order'); // requires Order model
var Product = require('../models/product'); // requires Product model

// ===========================
//  Get all Orders
// ===========================
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

// ===========================
//  Create a Order
// ===========================
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

// ===========================
//  Get a Order by id
// ===========================
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

// ===========================
//  Delete a Order
// ===========================
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

// ===========================
//  Add Product to given Order
// ===========================
app.post('/:id/products', async (req, res) => {
    var orderId = req.params.id;
    // parse body request
    var body = req.body;
    var newProduct = {
        _id: body.id,
        quantity: parseInt(body.quantity, 10)
    };

    try {
        // get order
        let order = await Order.findById(orderId);

        // if order is 'Closed', do not allow add product
        if (order.status === 'Closed') {
            throw new Error('Order is already Closed');
        }

        // get product
        let product = await Product.findById(newProduct._id);

        // check product stock, if not sufficient send error
        if ((product.stock - newProduct.quantity) < 0) {
            throw new Error('There is insufficient stock of Product');
        }

        // decrement product stock
        product.stock -= newProduct.quantity;

        // save product
        let productDB = await product.save();

        // add product to order
        // if the Order already has that product increment the quantity
        if(order.items.id(newProduct._id)){
            order.items.id(newProduct._id).quantity += newProduct.quantity
        } else { // if not, add it to items
            order.items.push(newProduct);
        }

        // save order
        let orderDB = await order.save();

        // return updated order
        return res.json({
            ok: true,
            data: orderDB
        });
    
    } catch (err) {
        return res.status(500).json({
            ok: false,
            msj: 'Error adding product to order',
            errors: err.message
        });
    }

});

// ===========================
//  Delete product to given Order
// ===========================
app.put('/:id/products', async (req, res) => {
    var orderId = req.params.id;
    // parse body request
    var body = req.body;
    var deleteProduct = body.id;

    try {
        // get order
        let order = await Order.findById(orderId);

        // if order is 'Closed', do not allow delete product
        if (order.status === 'Closed') {
            throw new Error('Order is already Closed');
        }

        let oldProductQuantity;

        // check if the Product exists in the Order
        if (order.items.id(deleteProduct)) {
            oldProductQuantity = order.items.id(deleteProduct).quantity;
            order.items.id(deleteProduct).remove();
        } else { // if not, send error
            throw new Error('Product does not exist in the order');
        }

        // get product
        let product = await Product.findById(deleteProduct);

        // increment product stock
        product.stock += oldProductQuantity;

        // save product
        let productDB = await product.save();

        // save order
        let orderDB = await order.save();

        // return updated order
        return res.json({
            ok: true,
            data: orderDB
        });

    } catch (err) {
        return res.status(500).json({
            ok: false,
            msj: 'Error updating Product stock',
            errors: err.message
        });
    }

});

// ===========================
//  Checkout a Order
// ===========================
app.get('/:id/checkout', async (req, res) => {
    var orderId = req.params.id;
    
    try {
        // get order
        order = await Order.findById(orderId);

        // if order is 'Closed' do not checkout again
        if (order.status === 'Closed') {
            throw new Error('Order is already Closed');
        }

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
        
        // update order status and order close date
        order.status = 'Closed';
        order.closedDate = Date.now();

        // save order
        let orderDB = await order.save();

        // return updated order
        return res.json({
            ok: true,
            data: orderDB
        });

    } catch (err) {
        return res.status(500).json({
            ok: false,
            msj: 'Error checking out',
            errors: err.message
        });
    }

});

module.exports = app;