const express = require('express')

const {auth, hasRoles } = require('../middleware/auth')
const multer = require('multer')

const sellerController = require('../controllers/sellerController');
const router = new express.Router()

// router.get("/", auth.hasRole("user"), controller.index);
// router.get("/:id", auth.hasRole("user"), controller.show);
// router.post("/", auth.hasRole("manager"), controller.create);
// router.put("/:id", auth.hasRole("manager"), controller.update);
// router.patch("/:id", auth.hasRole("manager"), controller.update);
// router.delete("/:id", auth.hasRole("manager"), controller.destroy);

// hasRoles(['admin', 'seller'])

router.post('/seller/item/add',auth,sellerController.addItem) 

router.patch('/seller/item/:id',auth, sellerController.editItem)

router.delete('/seller/item/:id',auth, sellerController.deleteItem )
router.get('/seller/items',auth,sellerController.allItems)

router.get('/seller/item/:id',auth, sellerController.getSingleItem)

module.exports=router