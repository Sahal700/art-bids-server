const mongoose = require('mongoose')

connectionString = process.env.DATABASE

mongoose.connect(connectionString).then(()=>{
  console.log('mongodb connected successfully');
}).catch((err)=>{
  console.log(`mogodb failed to connect due to ${err}`);
})