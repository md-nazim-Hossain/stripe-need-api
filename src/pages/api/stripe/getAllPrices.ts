
const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async (req:any, res:any) => {
  try{
    const prices = await stripe.prices.list({
        limit: 5,
    });
   res.status(200).json({status:true,prices})
    
  }catch(error:any){
    res.status(503).json({status:false,error:error.message})
  }
}