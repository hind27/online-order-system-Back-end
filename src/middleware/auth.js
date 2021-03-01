const jwt = require('jsonwebtoken')




const auth = async(req, res, next)=>{
    const token = req.header('Authorization').replace('Bearer ', '')
     if (!token) return res.status(401).send("Access denied");
    try{
        const decodedToken = jwt.verify(token, process.env.JWTKEY)
        const user = await User.findOne({_id: decodedToken._id, 'tokens.token':token ,  role: user.role})
        
        if(!user) throw new  Error("User cannot find!!");
        //user.isVerified = true;
        req.user= user
        req.user.role = role
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
//app.get('/api/test', hasRoles(['admin', 'freelancer'], callback);
function hasRoles(roles) {
  return hasRoles[roles] || (hasRoles[roles] = function(req, res, next) {
      var isAllowed = false,
        user = req.session.user;

    roles.forEach(function(role) {
        user.roles.forEach(function(userRole) {
          // roles must be in lowercase
          if(role === userRole) {
            isAllowed = true;
          }
        });
    });

    if(!isAllowed) {
      res.send(401, {message: 'Unauthorized'});
    } else {
      next();
    }
  });
}


  
  
  module.exports = {
    auth,
    hasRoles
  }
// const isAdmin = async (req, res, next) => {

//     // no need to verify token again
//     // the `req.user.isAdmin` is already available from isAuth
//     // also no need to query a database, we have all the info we need from the token
//     if (!req.user.isAdmin)
//         return res.status(401).send({ msg: "Not an admin, sorry" });

//     next();
// };




