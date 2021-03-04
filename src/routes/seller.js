const express = require('express')

const {auth, hasRoles } = require('../middleware/auth')
const multer = require('multer')

const sellerController = require('../controllers/sellerController');
const router = new express.Router()

// hasRoles(['admin', 'seller'])

router.post('/seller/item/add',auth,sellerController.addItem) 

router.patch('/seller/item/:id',auth, sellerController.editItem)

router.delete('/seller/item/:id',auth, sellerController.deleteItem )
router.get('/seller/items',auth,sellerController.allItems)

router.get('/seller/item/:id',auth, sellerController.getSingleItem)

module.exports=router