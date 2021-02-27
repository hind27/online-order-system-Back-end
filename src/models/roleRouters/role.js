const mongoose = require('mongoose');
const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  routers: [
    {
      router: {type: mongoose.Schema.ObjectId, ref:"Routes" }
    },
  ]
},
    {timestamps: true}
);



const Role =  mongoose.model("Role", RoleSchema);
module.exports = Role