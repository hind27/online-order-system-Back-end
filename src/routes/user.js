
const express = require('express')
const User = require("../models/user");
const Seller = require('../models/seller')
const Item = require('../models/item')
const {auth, authRole } = require('../middleware/auth')
const multer = require('multer')
const bcrypt = require('bcryptjs')
const userController = require('../controllers/userController');
const sellerController = require('../controllers/sellerController');

const router = new express.Router()


router.post('/signup', userController.signupUser);
router.post('/login', userController.login);
router.post('/user/logout',auth, userController.logout)
router.post('/user/logoutAll',auth, userController.logoutAll)
router.get('/user/me',auth, async(req,res)=>{
    res.status(200).send({
        error: null,
        apiStatus:true,
        data: {user:req.user}
    })
})
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

router.post('/user/changePassword', auth, async(req, res)=>{
    try{
        if(!req.body.old_pass || !req.body.new_pass) throw new Error('invalid data')
        const matched = await bcrypt.compare(req.body.old_pass, req.user.password)
        if(!matched) throw new Error('invalid user old password')
        req.user.password = req.body.new_pass
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
//edit phone and name
router.patch('/user/me', auth, async(req, res)=>{
    const allowedUpdates =['firstName','lastName', 'phone']
    const updates = Object.keys(req.body)
    const validateEdits = updates.every(update=> allowedUpdates.includes(update))
    if(!validateEdits) return res.status(400).send({
        apiStatus:false,
        message:'unavailable updates',
        error:true
    })
    try{
        updates.forEach(update=>req.user[update] = req.body[update])
        await req.user.save()
        res.status(200).send({
            error: null,
            apiStatus:true,
            data: {user: req.user}
        })
    }
    catch(error){
        res.status(400).send({
            error: error.message,
            apiStatus:false,
            data: 'unable to update'
        })
    }
})
//delete user
router.delete('/user/me', auth, async(req, res)=>{
    try{
        await req.user.remove()
        res.status(200).send({
            error: null,
            apiStatus:true,
            data: 'deleted'
        })
    }
    catch(error){
        res.status(400).send({
            error: error.message,
            apiStatus:false,
            data: 'unauthorized user'
        })
    }
})
router.post('/seller/item/add', auth, sellerController.addItem) 

router.patch('/seller/item/:id', auth, sellerController.editItem)

router.delete('/seller/product/:id', auth, sellerController.deleteItem )
router.get('/seller/products', auth, sellerController.allItems)

router.get('/seller/product/:id',sellerController.getSingleItem)
    


module.exports=router
