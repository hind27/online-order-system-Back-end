const jwt = require('jsonwebtoken')



const auth = async(req, res, next)=>{
    const token = req.header('Authorization').replace('Bearer ', '')
     if (!token) return res.status(401).send("Access denied");
    try{
        const decodedToken = jwt.verify(token, process.env.JWTKEY)
        const user = await User.findOne({_id: decodedToken._id, 'tokens.token':token})
        
        if(!user) throw new Error()
        //user.isVerified = true;
        req.user= user
        next()
    }
    catch(error){
        res.status(400).send({
            error: error,
            apiStatus:false,
            data: 'Invalid token '
        })
    }
}


function authRole(role) {
    return (req, res, next) => {
      if (req.user.role !== role) {
        res.status(401)
        return res.send('Not allowed')
      }
  
      next()
    }
  }
  
  
  module.exports = {
    auth,
    authRole
  }
// const isAdmin = async (req, res, next) => {

//     // no need to verify token again
//     // the `req.user.isAdmin` is already available from isAuth
//     // also no need to query a database, we have all the info we need from the token
//     if (!req.user.isAdmin)
//         return res.status(401).send({ msg: "Not an admin, sorry" });

//     next();
// };




