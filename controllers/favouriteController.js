const favourites = require("../model/favouriteModel")

exports.addFavouriteCOntrroller = async(req,res)=>{
  const {id} = req.params
  const userId = req.payload
  try {
    const existingFavourite = await favourites.findOne({userId})
    if (existingFavourite) {
      
      const updateFavourite= await favourites.findOneAndUpdate({userId},{ $addToSet: { auctions: id } },{ new: true } )
      res.status(200).json(updateFavourite)
    }else{
      const newFavourite = new favourites({
        userId,
        auctions:[id]
      })
      await newFavourite.save()
      res.status(201).json(newFavourite)
    }
  } catch (error) {
    res.status(401).json(error)
  }
}

exports.getFavouriteController = async(req,res)=>{
  userId = req.payload
  try {
    const existingFavourite = await favourites.findOne({userId}).populate("auctions")
    if (existingFavourite) {
      res.status(200).json(existingFavourite)
    }else{
      res.status(406).json("no favourite auctions available")
    }
  } catch (error) {
    res.status(401).json(error)
  }
}

exports.removeFavouriteController = async(req,res)=>{
  
  userId = req.payload
  const {id} =req.params
  try{
    const existingFavourite = await favourites.findOneAndUpdate({userId},{$pull:{auctions:id}},{ new: true })
    // console.log(existingFavourite);
    if (existingFavourite.auctions?.length<=0) {
      await favourites.findByIdAndDelete({_id:existingFavourite._id})
    }
    res.status(200).json(existingFavourite)
  }catch(error){
    console.log(error);
    res.status(401).json(error)
  }
}
