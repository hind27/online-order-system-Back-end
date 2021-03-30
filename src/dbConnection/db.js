const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB,{
  useNewUrlParser: true,
   useCreateIndex: true  ,
    useUnifiedTopology:true
  , usePushEach: true }).then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });