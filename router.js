const express = require('express')
const userController = require('./controllers/userController')
const auctionController = require('./controllers/auctionController')
const favouriteController = require('./controllers/favouriteController')
const bidController = require('./controllers/bidController')
const walletController = require('./controllers/walletController')
const jwtMiddleware = require('./middleware/jwtMiddleware')
const multerconfig = require('./middleware/multerMiddleware')

const router = new express.Router()

// register
router.post('/register',userController.registerUserController)
// login
router.post('/login',userController.loginUserController)
// add auction
router.post('/add-auction',jwtMiddleware,multerconfig.single('image'),auctionController.addAuctionController)
// get user auction
router.get('/user-auctions',jwtMiddleware,auctionController.getUserAuction)
// view action
router.get('/view-auction/:id',jwtMiddleware,auctionController.viewAuctionController)
// update auction 
router.put('/edit-auction/:id',jwtMiddleware,multerconfig.single('image'),auctionController.updateUserAuctionController)
//remove auction
router.delete('/remove-auction/:id',jwtMiddleware,auctionController.removeUserAuctionController) 
// get all auction
router.get('/get-all-auction',auctionController.getAllAuctionController)
// get user details
router.get('/get-user',jwtMiddleware,userController.getUserController)
// add favourite
router.post('/add-favourite/:id',jwtMiddleware,favouriteController.addFavouriteCOntrroller)
// get favourite
router.get('/get-favourite',jwtMiddleware,favouriteController.getFavouriteController)
// remove favourte
router.put('/remove-favourite/:id',jwtMiddleware,favouriteController.removeFavouriteController)
// update or add bids to auction
router.put('/update-bid/:id',jwtMiddleware,auctionController.updateBidsController)
// add auction to bids collection
router.post('/add-bids-to-collection/:id',jwtMiddleware,bidController.addBidController)
// get all bids
router.get('/get-all-bids',jwtMiddleware,bidController.getAllBidController)
// update profile
router.put('/update-profile',jwtMiddleware,multerconfig.single('profile'),userController.updateUserController)
// admin apis
// update auction status
router.put('/auction/:id/update-status',jwtMiddleware,auctionController.updateAuctionStatusController)
// path to get all users for admin
router.get('/admin/get-all-users',jwtMiddleware,userController.getAllUserController)
// get all auction
router.get('/admin/get-all-auction',jwtMiddleware,auctionController.getAllAdminAuctionController)
// path to create order for razorpay
router.post('/create-order',jwtMiddleware,walletController.createOrderController)
module.exports = router