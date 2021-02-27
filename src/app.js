const express=require('express')
const path= require('path')
const http = require('http')
require('./dbConnection/db')
const userRoutes = require('./routes/user')
const multer = require("multer");
const cors = require("cors");
const soketio = require('socket.io')
const app = express()
const server =http.createServer(app)
const io = soketio(server)

app.use(express.json())
app.use(userRoutes)
app.use(cors())
// app.use("/auth", upload.array("images", 10), authRoutes);
// app.use("/seller", upload.single("image"), itemRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

// io.on(express.static(p))
// io.on('connection',(socket)=>{
//    console.log('new socket')
//    socket.on('disconnect',()=>
//    console.log('disconnected'))
// })

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "images");
    },
    filename: (req, file, cb) => {
        
      cb(null,Math.floor(Math.random() * 90000) + 10000 + "-" + file.originalname
      );
    },
  });
  
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg"
    )
      cb(null, true);
    else cb(null, false);
  };
  
  const upload = multer({ storage: fileStorage, fileFilter: fileFilter });



module.exports = app