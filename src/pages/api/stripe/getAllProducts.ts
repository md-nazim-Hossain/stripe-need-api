
const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async (req:any, res:any) => {
  try{
    const products = await stripe.products.list({
        limit: 5,
    });
   res.status(200).json({status:true,products})
    
  }catch(error:any){
    res.status(503).json({status:false,error:error.message})
  }
}