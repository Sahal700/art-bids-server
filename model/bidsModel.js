const mongoose = require('mongoose')

const bidSchema = new mongoose.Schema({
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

const bids = mongoose.model("bids",bidSchema)

module.exports = bids