
const User = require('../models/user')
const Seller = require('../models/seller')
const Item = require('../models/item')
const Cart = require('../models/cart');

    
exports.getStores = (req, res) => {
  User.find({role: 'seller'}).populate('storeinfo').exec(function(err, stores){
    if(err){
        console.log(err);
    }else{
 
     return res.status(200).send({
          error: null,
          apiStatus:true,
          stores
      }) 
    }   
  })
}
  // Get a single restaurant
exports.showSingleStore = async(req, res)=>  {
    try {
        const items = await Item.find({ owner: req.params.id})
        User.findById(req.params.id)
          .populate('storeinfo')
           .exec(function(err, store) {
             if (err) {
                 res.status(400).send({
                     error: err.message,
                     apiStatus:false,
                     data: "store not found"
                 })
             }
       
             if (!store) {
               return res.status(400).send({
                 error: err.message,
                 apiStatus:false,
                 data: "store not found"
                 })
             }
       
             return res.status(200).send({
                 error: null,
                 apiStatus:true,
                 data:{store , items}
             })
           });
    } catch (error) {
        res.status(400).send({
            error: error.message,
            apiStatus:false,
            data: 'cant get store item '
        })
    }
   
      };
  
  
exports.signupUser = async (req, res, next) => {  
  const email = req.body.email;
  const first_name = req.body.first_name;
  const password = req.body.password;
  const last_name = req.body.last_name;
  const mobileNumber = req.body.mobileNumber;
  const address = req.body.address
  const role = req.body.role;
    const seller = new Seller(req.body)
    try{
        if(role=='seller'){
            await seller.save()
            const user = new User({
                first_name: first_name,
                last_name: last_name,
                password: password,
                email:email,
                role:role,
                address: address,
                mobileNumber: mobileNumber,
               storeinfo: seller._id,
              });
            await user.save()
            const token = await user.generateToken()
            res.status(200).send({
                error: null,
                apiStatus:true,
                data: {user,seller ,token}
            })
        }
        const user = new User({
            first_name: first_name,
            last_name: last_name,
            password: password,
            email:email,
            role:role,
            address: address,
            mobileNumber: mobileNumber,
          });
        await user.save()
        const token = await user.generateToken()
        res.status(200).send({
            error: null,
            apiStatus:true,
            data: {user, token}
        })
    }
    catch(error){
        res.status(400).send({
            error: error.message,
            apiStatus:false,
            data: 'unauthorized user'
        })

    }
}   


exports.login = async (req, res) => {
    try{
        const user = await User.findUserByCredentials(req.body.email, req.body.password)
        const token = await user.generateToken()
        if(user.role=='seller'){
            console.log(user._id)
           await User.findOne({_id: user._id}).populate('storeinfo').exec(function(err, user) {
            if (err) {console.log(err)}
            res.status(200).send({
                error: null,
                apiStatus:true,
                user,token
            })})
        }
        res.status(200).send({
            error: null,
            apiStatus:true,
            data: {user, token}
        })
    }
    catch(error){
        res.status(400).send({
            error: error.message,
            apiStatus:false,
            data: 'Something went wrong'
        })
       
    }
}
//working
exports.logout = async (req, res, next) => {
    try{
        req.user.tokens = req.user.tokens.filter((singleToken)=>{
            return singleToken.token != req.token
        })
        await req.user.save()
        res.status(200).send({
            error: null,
            apiStatus:true,
            data: 'logged out successfully'
        })
    }
    catch(error){
        res.status(400).send({
            error: error.message,
            apiStatus:false,
            data: error.message
        })
        next(error);
    }
}

exports.logoutAll = async (req, res, next) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send({
            error: null,
            apiStatus:true,
            data: 'logged out successfully'
        })
    }
    catch(error){
        res.status(400).send({
            error: error.message,
            apiStatus:false,
            data: error.message
        })
        next(error);
    }
}


exports.showMe = async (req, res, next) => {
    res.status(200).send({
        error: null,
        apiStatus:true,
        data: {user:req.user}
    })
}

exports.changePassword = async(req, res)=>{
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
            message:'Password changed'
        })
    }
    catch(e){
    res.status(400).send({
        error:e.message,
        apiStatus:false,
        data:'',
        message:'password change problem'
    })
    }
}
exports.editUser = async(req, res)=>{
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
}

exports.deleteUser= async(req, res)=>{
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
}

