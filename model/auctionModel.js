const mongoose = require('mongoose')

const auctionSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  description: {
    type: String,
    required: true,
  },
  startingPrice: {
    type: Number,
    required: true,
  },
  currentBid: {
    type: Number,
    default:0
  },
  endTime: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  bids: {
    type:[
    {
      bidderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      bidTime: {
        type: Date,
        default: Date.now,
      },
    },
  ]
},
image: {
  type: String,
  required: true
},
status: {
  type: String,
  enum: ["active", "completed", "rejected","pending"],
},
width:{
  type:String,
  required:true
},
height:{
  type:String,
  required:true
},
highestBidder:{
  type: mongoose.Schema.Types.ObjectId,
  ref: "users",
  default:''
}
})

const auctions = mongoose.model("auctions",auctionSchema)

module.exports = auctions