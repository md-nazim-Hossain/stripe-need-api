
const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async (req:any, res:any) => {
    const {priceId} = req.body
  try{
    const prices = await stripe.prices.retrieve(priceId);
   res.status(200).json({status:true,prices})
    
  }catch(error:any){
    res.status(503).json({status:false,error:error.message})
  }
}