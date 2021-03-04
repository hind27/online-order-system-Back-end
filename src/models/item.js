const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please Include the product name"]
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true
  },
    imageUrl: {
      type: String,
     // required: true,
    },
    price: {
      type: Number,
      required: [true, "Please Include the product price"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Seller'
  }
}, {
  timestamps: true
})
Item = mongoose.model('Item', itemSchema)

module.exports = Item

