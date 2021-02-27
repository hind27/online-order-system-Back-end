  
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const SellerSchema = mongoose.Schema(
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
  },
  { timestamps: true }
);

SellerSchema.virtual('item', {
    ref: 'item',
    localField: '_id',
    foreignField: 'owner'
})



Seller = mongoose.model('Seller', SellerSchema)

module.exports = Seller