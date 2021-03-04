const User = require('../models/user')
const Seller = require('../models/seller')
const Item = require('../models/item')
const Cart = require('../models/cart')


exports.findcart = async () => {
    const carts = await Cart.find().populate({
        path: "items.productId",
        select: "name price total"
    });;
    return carts[0];
};
exports.addItem = async payload => {
    const newItem = await Cart.create(payload);
    return newItem
}

exports.addItemToCart = async (req, res) => {
    const itemId = req.query.itemId
    const quantity = Number.parseInt(req.body.quantity);
        try {
            let cart = await Cart.findOne({userId:req.user._id})
            let productDetails = await Item.findById(itemId);
                 if (!productDetails) {
                return res.status(500).send({
                    error: err.message,
                    apiStatus:false,
                    message: " item Not Found ",
                })
            }
            //--If Cart Exists ----
            if (cart) {
                //---- check if index exists ----
                const indexFound = cart.cartItems.findIndex(item => item.productId.id == itemId);
                //------this removes an item from the the cart if the quantity is set to zero,We can use this method to remove an item from the list  -------
                if (indexFound !== -1 && quantity <= 0) {
                    cart.cartItems.splice(indexFound, 1);
                    if (cart.cartItems.length == 0) {
                        cart.subTotal = 0;
                    } else {
                        cart.subTotal = cart.cartItems.map(item => item.total).reduce((acc, next) => acc + next);
                    }
                }
                //----------check if product exist,just add the previous quantity with the new quantity and update the total price-------
                else if (indexFound !== -1) {
                    cart.cartItems[indexFound].quantity = cart.cartItems[indexFound].quantity + quantity;
                    cart.cartItems[indexFound].total = cart.cartItems[indexFound].quantity * productDetails.price;
                    cart.cartItems[indexFound].price = productDetails.price
                    cart.subTotal = cart.cartItems.map(item => item.total).reduce((acc, next) => acc + next);
                }
                //----Check if Quantity is Greater than 0 then add item to items Array ----
                else if (quantity > 0) {
                    cart.cartItems.push({
                        productId: itemId,
                        quantity: quantity,
                        price: productDetails.price,
                        total: parseInt(productDetails.price * quantity)
                    })
                    cart.subTotal = cart.cartItems.map(item => item.total).reduce((acc, next) => acc + next);
                }
                //----if quantity of price is 0 throw the error -------
                else {
                    return res.status(400).send({
                        error: err.message,
                        apiStatus:false,
                        message: "Invalid request"
                    })
                }
                let data = await cart.save();
                res.status(200).send({ 
                    error: null,
                    apiStatus:true,
                    message: "Process Successful",
                    data: data
                })
            }
            //------------ if there is no user with a cart...it creates a new cart and then adds the item to the cart that has been created------------
            else {
                const cartData = {
                    cartItems: [{
                        productId: itemId,
                        quantity: quantity,
                        total: parseInt(productDetails.price * quantity),
                        price: productDetails.price
                    }],
                    subTotal: parseInt(productDetails.price * quantity)
                }
                
                cart = await Cart.create(cartData)
                // let data = await cart.save();
                res.json(cart);
            }
        } catch (err) {
            console.log(err)
            res.status(400).send({
                                error: err.message,
                                apiStatus:false,
                                data: "Something Went Wrong"
                            })
        }

    }
    exports.getCart = async (req, res) => {
        try {
            let cart = await Cart.findOne({userId:req.user._id})
            if (!cart) {
                return res.status(400).json({
                    type: "Invalid",
                    msg: "Cart Not Found",
                })
            }
            res.status(200).json({
                status: true,
                data: cart
            })
        } catch (err) {
            console.log(err)
            res.status(400).send({
               error: err.message,
                    apiStatus:false,
                    data: "Something Went Wrong"
            })
        }
    }
    
    exports.emptyCart = async (req, res) => {
        try {
            let cart = await Cart.findOne({userId:req.user._id})
            cart.cartItems = [];
            cart.subTotal = 0
            let data = await cart.save();
            res.status(200).json({
                type: "success",
                mgs: "Cart Has been emptied",
                data: data
            })
        } catch (err) {
            console.log(err)
            res.status(400).json({
                type: "Invalid",
                msg: "Something Went Wrong",
                data: err.message
            })
        }
    }
    exports.postCartRemove = async(req, res)=>{

    }