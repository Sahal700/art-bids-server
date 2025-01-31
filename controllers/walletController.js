const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


exports.createOrderController = async (req, res) => {
  try {
    const {amount} = req.body
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }
    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `wallet_topup_${Date.now()}`,
    };
    
    const order = await razorpay.orders.create(options);
    
    res.status(200).json(order)
    
  } catch (error) {
    res.status(401).json(error);
  }
}
