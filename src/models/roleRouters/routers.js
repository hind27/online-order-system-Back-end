
const mongoose = require('mongoose');

const RoutesSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true,
      },
    },
    {timestamps: true}
);
RoutesSchema.virtual('user_routers', {
  ref:'Role',
  localField: '_id',
  foreignField:'routers.router'
})

 
const Routers =  mongoose.model("Routes", RoutesSchema);
module.exports = Routers