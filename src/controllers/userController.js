
const User = require('../models/user')
const Seller = require('../models/seller')

    
exports.getStores = (req, res) => {
    Seller.find(function(err, stores) {
        if (err) {
          return err
        }
     return res.status(200).send({
          error: null,
          apiStatus:true,
          data: {stores}
      })
      });

    
  };

  // Get a single restaurant
exports.showSingleStore = function(req, res) {
    Seller.findById(req.params.id)
      .populate("_Items")
      .exec(function(err, store) {
        if (err) {
          return handleError(res, err);
        }
  
        if (!store) {
          return res.send(404);
        }
  
        return res.status(200).send({
            error: null,
            apiStatus:true,
            data: {store}
        })
      });
  };
exports.signupUser = async (req, res, next) => {  
    role = req.body.role
    const user = new User(req.body)
    const seller = new Seller(req.body)
    try{
        if(role=='seller'){
            await seller.save()
            await user.save()
            const token = await user.generateToken()
            res.status(200).send({
                error: null,
                apiStatus:true,
                data: {user,seller ,token}
            })
        }
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


exports.login = async (req, res, next) => {
    try{
         const user = await User.findUserByCredentials(req.body.email, req.body.password)
         let seller 
        const token = await user.generateToken()
        if(user.role=='seller'){
          
            seller= await Seller.find({_id:user._userId}).populate("_Seller")
            res.status(200).send({
                error: null,
                apiStatus:true,
                data: {user,seller,token}
            })
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
            data: 'unauthorized user'
        })
        next(error);
    }
}
//not working
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