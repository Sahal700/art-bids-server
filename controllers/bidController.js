const bids = require("../model/bidsModel")

exports.addBidController = async(req,res)=>{
  const userId = req.payload
  const {id} = req.params
  try {
    const existingbid = await bids.findOne({userId})
    if (existingbid) {
      const updatebid= await bids.findOneAndUpdate({userId},{ $addToSet: { auctions: id } },{ new: true } )
      res.status(200).json(updatebid)
    }else{
      const newbid = new bids({
        userId,
        auctions:[id]
      })
      await newbid.save()
      res.status(201).json(newbid)
    }
  } catch (error) {  
    res.status(401).json(error)
  }
}

exports.getAllBidController = async(req,res)=>{
  const userId = req.payload
  try {
    const existingBid = await bids.findOne({ userId }).populate({
      path: 'auctions', 
      populate: { path: 'bids.bidderId', model: 'users' },
    });
    if (existingBid) {
      res.status(200).json(existingBid)
    }else{
      res.status(406).json("no bids available")
    }
  } catch (error) {
    res.status(401).json(error)
  }
}