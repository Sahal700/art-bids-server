const mongoose = require('mongoose')

const favouriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  auctions:{
    type:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"auctions"
      }
    ]
  }
})

const favourites = mongoose.model('favourites',favouriteSchema)

module.exports = favourites