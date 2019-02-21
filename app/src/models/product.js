
// Schema defined for Products collection

// Required parameters are title and stock.

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: false},
    price: {type: String, required: false},
    stock: {type: String, required: true},
}, {collection: 'products'});

module.exports = mongoose.model('Product', productSchema);
