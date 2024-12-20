const auctions = require("../model/auctionModel")
const schedule = require("node-schedule")

exports.addAuctionController=async(req,res)=>{
  const {title,description,startingPrice,endTime,width,height}=req.body
  const image=req.file.filename
  const userId = req.payload

  try{
    const newAuction = new auctions({
      title,
      description,
      startingPrice,
      endTime,
      userId,
      bids:[],
      image,
      status:'pending',
      width,
      height
    })
    await newAuction.save()
    res.status(200).json(newAuction)
  }catch(err){
    res.status(401).json(err)
  }

}

exports.getUserAuction = async(req,res)=>{
  const userId = req.payload
    try{
        const userAuction = await auctions.find({userId})
        if(userAuction){
            res.status(200).json(userAuction)
        }else{
            res.status(406).json("No auction available")
        }
    }catch(error){
        res.status(401).json(error)
    }
}

// update user auction
exports.updateUserAuctionController = async(req,res)=>{
  const {id} = req.params
  const userId = req.payload
  
  const {title,description,startingPrice,endTime,width,height,image}=req.body

  uploadedImage = req.file?req.file.filename:image
  try{
      const existingAuction = await auctions.findByIdAndUpdate({_id:id},{
          title,
          description,
          startingPrice,
          endTime,
          width,
          height,
          image:uploadedImage
      },{new:true})
      // console.log(existingProject);
      
      await existingAuction.save()
      res.status(200).json(existingAuction)

  }catch(error){
      res.status(401).json(error)
  }
}

exports.removeUserAuctionController = async(req,res)=>{
  const {id} =req.params
  
  try{
      await auctions.findByIdAndDelete({_id:id})
      res.status(200).json('deleted successfully')
  }catch (error){
      res.status(402).json(error)
  }
  
}

exports.viewAuctionController = async(req,res)=>{
  const {id} = req.params
  try{
    const existingAuction = await auctions.findOne({_id:id}).populate("userId","username profile").populate("bids.bidderId", "-password")

    res.status(200).json(existingAuction)
  }catch(error){
    res.status(402).json(error)
  }
}

exports.getAllAuctionController = async(req,res)=>{
  const userId = req.payload
  try{
    const allAuction = await auctions.find({ status: { $eq: "active" },userId:{$ne:userId} } ).populate("userId","username profile")
    if(allAuction){
        res.status(200).json(allAuction)
    }else{
        res.status(406).json("No auction available")
    }
  }catch(error){
      res.status(401).json(error)
  }
}

exports.updateBidsController = async(req,res)=>{
  const userId = req.payload
  const {id} = req.params
  const {amount} = req.body 
  try {
    const existingAuction = await auctions.findById({_id:id})
    if(existingAuction){
      if(existingAuction.status = "active"){
        if (existingAuction.startingPrice <= amount) {
          if (existingAuction.currentBid >= amount) {
            res.status(406).json('amout must be greater than current bid')
          }else{
            const bidderIndex = existingAuction.bids.findIndex((item)=>item.bidderId==userId)
            // console.log(bidderIndex);
            
            if (bidderIndex !== -1) {
              existingAuction.bids[bidderIndex].amount = amount
              existingAuction.bids[bidderIndex].bidTime = Date.now()
              existingAuction.currentBid = amount;
              existingAuction.highestBidder=userId;
              await existingAuction.save()
              res.status(201).json("bid updated")
            }else{
              existingAuction.bids.push({
                bidderId: userId,
                amount: amount,
              });
              existingAuction.currentBid = amount;
              existingAuction.highestBidder=userId;
              await existingAuction.save()
              res.status(200).json("bid created updated")
            }
          }
        }else{
          res.status(408).json("amount must be greater than starting price")
        }
      }else{
        res.status(407).json("auction is completed")
      }
    }
    
    
  } catch (error) {
    res.status(401).json(error)
  }
   
}

exports.updateAuctionStatusController = async(req,res)=>{
  const {id} = req.params
  const status = req.query.status

  try {
    const existingAuction = await auctions.findByIdAndUpdate({_id:id},{
      status
    },{new:true})
    // console.log(existingAuction.endTime);
    const endTime = new Date(existingAuction.endTime)
    endTime.setHours(23, 59, 59, 0);
    console.log(endTime.toString());
    schedule.scheduleJob(endTime,async ()=>{
      console.log(`Scheduled job triggered for auction ID: ${id}`);

      // Perform the required task here (e.g., mark auction as completed)
      await auctions.findByIdAndUpdate(
        { _id: id },
        { status: "completed" }, // Example: Mark the auction as "completed"
        { new: true }
      );

      console.log(`Auction ${id} marked as completed.`);
    })
    
    res.status(200).json(existingAuction)
  } catch (error) {
    res.status(401).json(error)
  }
}
