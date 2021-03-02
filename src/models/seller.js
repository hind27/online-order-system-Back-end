  
const mongoose = require("mongoose"),
Schema = mongoose.Schema;
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const SellerSchema = Schema(
  {
    storeName: {
      required: true,
      type: String,
    },
    category: {
      type: String,
      required: true
     },
    imageUrl: {
      type: String,
     // required: true,
    }, 
    addresses:[
               {
                  street: String,
                  locality: String,
                  aptName: String,
                  lat: Number,
                  lng: Number,
                 
                }
          ],
       
    numberOfBranches: Number,
    _userId:{ type: Schema.Types.ObjectId, ref: 'User'},
    _Items: [{ type: Schema.Types.ObjectId, ref: "Item" }]
  },
  { timestamps: true }
);

SellerSchema.virtual('item', {
    ref: 'Item',
    localField: '_id',
    foreignField: 'owner'
})



Seller = mongoose.model('Seller', SellerSchema)

module.exports = Seller