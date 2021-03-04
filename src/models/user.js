  
const mongoose = require("mongoose"),
Schema = mongoose.Schema;
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new Schema({

    first_name: { type: String,required:true},
    last_name: { type: String,required:true},
    email: { type: String, unique: true, required: true, trim: true,lowercase: true ,validate(value) {
      if (!validator.isEmail(value)) throw new Error("Invalid Email");  },
    },
    password: { type: String,minlength: 6,required: true, trim: true, match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/},
    role: { type: String, enum: ['admin','seller', 'user'], default: 'user' ,required: true},
    mobileNumber: { type: String,default:'',trim: true,
      validate(value) {
        if (!validator.isMobilePhone(value, ["ar-EG"]))
          throw new Error("invalid phone number");
      },
    }, 
    address: {
        type: String,
        required: true,
        trim: true
    },
    _Seller:{    
         type:Schema.Types.ObjectId,
         ref:'Seller',
    },

    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})
userSchema.virtual('seller', {
    ref: 'Seller',
    localField: '_id',
    foreignField: '_userId'
})
userSchema.virtual('cartitem',{
    ref:'Cart',
    localField:'_id',
    foreignField:'user'

})

userSchema.virtual('fullName').get(function() {
    return this.first_name + ' ' + this.last_name;
  });
//handle json data
userSchema.methods.toJSON = function(){
    const user = this.toObject()
    delete user.password
    delete user.tokens
    delete user.__v
    return user
}

//encrypt password
userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 12)
    }
    next()
})


//generate token 
userSchema.methods.generateToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString() , role:user.role}, process.env.JWTKEY)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
// login
userSchema.statics.findUserByCredentials =  async(email, password)=>{
    const user = await User.findOne({email})
    if(!user) throw new Error('invalid email')
    const matched = await bcrypt.compare(password, user.password)
    if(!matched) throw new Error('invalid password')
    return user
}
const User = mongoose.model('User', userSchema)
 module.exports = User