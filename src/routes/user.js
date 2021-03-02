
const express = require('express')
const User = require("../models/user");
const Seller = require('../models/seller')
const Item = require('../models/item')
const {auth, hasRoles } = require('../middleware/auth')
const multer = require('multer')
const bcrypt = require('bcryptjs')
const userController = require('../controllers/userController');


const router = new express.Router()

//register or boss user and seller 
router.post('/signup', userController.signupUser);
//login user
router.post('/login', userController.login);
//logout single devices
router.post('/user/logout',auth, userController.logout)
//logout of all devices
router.post('/user/logoutAll',auth, userController.logoutAll)
//user Profile
// hasRoles(['admin', 'user']),
router.get('/user/me',auth,userController.showMe)
//edit Password
router.post('/user/changePassword', auth, hasRoles(['admin', 'user']), userController.changePassword)
//edit phone and name
router.patch('/user/me', auth, userController.editUser)
//delete user
router.delete('/user/me', auth, userController.deleteUser)
// Get list of stores
router.get("/", userController.getStores);
//Get a single Store 
router.get("/:id",userController.showSingleStore);
// add Address for order    
router.post('/user/add_address', auth, async(req, res)=>{
    
    const phoneNo = req.body.phoneNo;
    const street = req.body.street;
    const locality = req.body.locality;
    const aptName = req.body.aptName;
    const lat = req.body.lat;
    const lng = req.body.lng;
   
    address = {
        street: street,
        aptName: aptName,
        locality: locality,
        lat: lat,
        lng: lng,
        phoneNo: phoneNo,
    }
    try{
     //   if(!req.body.addr_type || !req.body.details) throw new Error('missing address details')
    req.user.addresses = req.user.addresses.concat(address)
    await req.user.save()
    res.status(200).send({
        error:null,
        apiStatus:true,
        data:{user: req.user},
        message:'address added'
    })
}
catch(e){
res.status(400).send({
    error:e.message,
    apiStatus:false,
    data:'',
    message:'address add problem'
})
}
})

module.exports=router
