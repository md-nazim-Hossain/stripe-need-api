
const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async (req:any, res:any) => {
    if (req.method === 'POST') {
        const {subscriptionId} = req.body
        try{
            const cancelSub = await stripe.subscriptions.update(subscriptionId, {cancel_at_period_end: true});
            res.status(200).json({status:true,cancelSub})
            
        }catch(error:any){
            res.status(503).json({status:false,error:error.message})
        }
    } else {
        res.status(403).json({ status: false, error: 'Invalid Method' });
  }
}