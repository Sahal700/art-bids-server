const users = require("../model/userModel")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const wallets = require("../model/walletModel")
// register
exports.registerUserController = async(req,res)=>{
  const {username , email , password} = req.body
  // console.log(username,email,password);
  
  try{
    const existingUser = await users.findOne({email}) 
    
    if(existingUser){
      res.status(406).json("User already exist")
    }else{
      const encryptPassword = await bcrypt.hash(password,10)
      const newUser = new users({
        username,
        email,
        password:encryptPassword,
        role:"user",
        profile:"",
        phone:"",
        address:"",
      })
      await newUser.save()
      const newWallet = new wallets({
        userId:newUser._id
      })
      await newWallet.save()
      res.status(200).json(newUser)
    }
  }catch(err){
    res.status(401).json(err)
  }
}

// login 
exports.loginUserController = async(req,res)=>{
  const {email,password} = req.body
  try{
    const existingUser = await users.findOne({email})
    // console.log(existingUser);
    
    if (existingUser) {
      const match = await bcrypt.compare(password,existingUser.password)
      // console.log(match);
      
      if(match==true){
        const token = jwt.sign({userId:existingUser._id},'secretkey')
        res.status(200).json({existingUser,token})
      }else{
        res.status(404).json("Invalid Password")
      }
    }else{
      res.status(406).json("Incorrect email")
    }
  }catch(err){
    res.status(401).json(err)
  }
}

exports.getUserController = async(req,res)=>{
  const userId = req.payload
  try {
    const existingUser = await users.findOne({_id:userId})
    res.status(200).json(existingUser)
  } catch (error) {
    res.status(401).json(error)
  }
}

exports.updateUserController = async(req,res)=>{
  const userId = req.payload

  const {username,phone,address,profile} = req.body
  const uploadedProfile = req.file?req.file.filename:profile
  try{
    const updatedUser =  await users.findByIdAndUpdate({_id:userId},{
      username,
      phone,
      address,
      profile : uploadedProfile
    },{new : true})
    res.status(200).json(updatedUser)
  }catch(err){
    res.status(401).json(err)
  }
}
exports.getAllUserController = async(req,res)=>{
  try {
    allUsers = await users.find().skip(1)
    res.status(200).json(allUsers)
  } catch (error) {
    res.status(401).json(error)
  }
}