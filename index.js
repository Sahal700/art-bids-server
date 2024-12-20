// import dot env
require('dotenv').config()

// import express
const express = require('express')

// import cors
const cors = require('cors')

// create server
const abserver = express()

// router import
const router = require('./router')

// import connection
require('./connection')

// use cors to connect frontend and backend
abserver.use(cors())


// parse data
abserver.use(express.json())

// use router
abserver.use(router)

// exporting uploaded folder
abserver.use('/upload',express.static('./uploads'))

// set port
const PORT = 4000 || process.env.PORT

// listen
abserver.listen(PORT,()=>{
  console.log(`ab server is running at port number ${PORT}`);
})
