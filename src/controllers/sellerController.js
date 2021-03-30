const express = require('express')
const User = require("../models/user");
const Seller = require('../models/seller')
const Item = require('../models/item')


  
  //additem
exports.addItem = async(req, res) =>{
    sellerid = Seller.findOne({_userId:req.user.id})
    try {
        const item = new Item({
            ...req.body,
            owner: req.user.id
        })
        await item.save()
        res.status(200).send({  
            error: null,
            apiStatus:true,
            message: "item added", 
            data:item })
    } catch (e) {
        res.status(500).send({ 
            error: e.message,
            apiStatus:false, 
            message: "internal server error" })
    }
}
exports.editItem = async(req, res)=>{
    const updates = Object.keys(req.body)
    const validkeys = ['title', 'description', 'category', 'price','imageUrl']
    const validrequest = updates.every((update) => validkeys.includes(update))
    if (!validrequest) return res.status(400).send({ error: "bad request" })
    try {
        const item = await Item.findOne({ _id: req.params.id, owner: req.user._id })
        updates.forEach(update => item[update] = req.body[update])
        await item.save()
        if (!item) return res.status(404).send({ error: "not found" })
        res.status(200).send({ item })
    } catch (e) {
        res.status(500).send({ message: "internal server error" })
    }
}
exports.deleteItem = async(req, res)=>{
    try {
        const item = await Item.deleteOne({ _id: req.params.id, owner: req.user._id })
        if (!item) return res.status(404).send({  message: "not found" })
        res.status(200).send({ error: null,
            apiStatus:true,
            data: 'product deleted' , item })
        console.log(product)
    } catch (e) {
        res.status(400).send({
            error: e.message,
            apiStatus:false,
            data: 'unauthorized user'
        })
    }
}
exports.allItems = async(req, res)=>{
    try {
        const items = await Item.find({ owner: req.user._id })
        res.status(200).send({
             error: null,
            apiStatus:true,
            message: "all items", items })
    } catch (err) {
        res.status(400).send({ 
            error: err.message,
            apiStatus:false,
            data: 'unauthorized user'
        }) 
    }
}
exports.getSingleItem = async(req, res)=>{
    try{
        const item = await Item.findOne({_id: req.params.id})
        item.clicks += 1 
        await item.save()
        if(!item) return res.status(400).send({message: "bad request"})
        res.status(200).send({item})
    } catch(err){
        res.status(400).send({ 
            error: err.message,
            apiStatus:false,
            data: 'unauthorized user'
        }) 
    }

    }
