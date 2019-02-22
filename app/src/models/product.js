
// Schema defined for Products collection

// Required parameters are title and stock.

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: false},
    price: {type: Number, required: false, default: 0},
    stock: {type: Number, required: true, default: 0},
}, {collection: 'products'});

module.exports = mongoose.model('Product', productSchema);
