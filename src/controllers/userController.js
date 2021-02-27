
const User = require('../models/user')
const Seller = require('../models/seller')

    

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
        else
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
      let seller=null
        const token = await user.generateToken()
        if(user.role=='seller'){
            seller= await Seller.find({_id:user.storeinfo})
            res.status(200).send({
                error: null,
                apiStatus:true,
                data: {user,seller,  token}
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

