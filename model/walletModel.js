const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", required: true,
    unique: true 
  },
  balance: { 
    type: Number,
    default: 0 
  },
});

const wallets = mongoose.model("wallets", walletSchema);
module.exports = wallets