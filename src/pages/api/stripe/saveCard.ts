const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async (req: any, res: any) => {
  if (req.method === 'POST') {
   const {customerId,tokenId} = req.body;
    try {
       const source = await stripe.customers.createSource(customerId,{
        source:tokenId
       });

       
    res.json({status:true,source})
      
    } catch (error: any) {
      res.status(503).json({ status: false, error: error.message });
    }
  } else {
    res.status(403).json({ status: false, error: 'Invalid Method' });
  }
};
