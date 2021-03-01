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



router.post('/seller/item/add',auth,hasRoles(['admin', 'seller']),sellerController.addItem) 

router.patch('/seller/item/:id',auth, hasRoles(['admin', 'seller']),sellerController.editItem)

router.delete('/seller/item/:id', hasRoles(['admin', 'seller']), sellerController.deleteItem )
router.get('/seller/items', hasRoles(['admin', 'seller']) ,sellerController.allItems)

router.get('/seller/item/:id', sellerController.getSingleItem)

module.exports=router