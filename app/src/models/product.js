
// Schema defined for Products collection

// The only one required parameter is title.

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: false},
    price: {type: String, required: false},
    stock: {type: String, required: false},
}, {collection: 'products'});

module.exports = mongoose.model('Product', productSchema);
