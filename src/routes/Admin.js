const express = require('express')
const User = require("../models/user");
const Account = require("../models/account");
const Seller = require("../models/seller");
const {auth, authRole } = require('../middleware/auth')



router.get("/adminPanel", auth, authRole(), (req, res) => {
    res.json({
        title: "ADMIN PANEL",
    });
});

module.exports=router