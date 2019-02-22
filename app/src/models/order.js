
// Schema defined for Order collection

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    creationDate: {type: Date, default: Date.now},
    status: {type: String, default: 'Open'},
    items : [
        {
            product: {type: Schema.Types.ObjectId, ref: 'Product'},
            quantity: Number
        }
    ],
    total: {type: Number, default: 0},
}, {collection: 'orders'});

module.exports = mongoose.model('Order', orderSchema);
