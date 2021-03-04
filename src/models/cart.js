const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cartSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    cartItems: [
       {
            productId:{type:Schema.Types.ObjectId, ref: 'Item' },
            quantity: {
                type: Number,
                required: true,
                min: [1, 'Quantity can not be less then 1.']
            },
            price: {
                type: Number,
                required: true
            },
            total: {
                type: Number,
                required: true,
            }

        }
    ],
    subTotal: {
        default: 0,
        type: Number
    },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date }
});

module.exports = mongoose.model('Cart', cartSchema);
