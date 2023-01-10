
const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async (req:any, res:any) => {
    if(req.method === 'POST'){
        const {customerId,priceId,trialDay} = req.body
        // const trialEnd = Date.now()+3600 * 1000 * 24
        try{
           const subscription = await stripe.subscriptions.create({
                customer: customerId,
                items: [{
                    price: priceId,
                }],
                payment_behavior: 'default_incomplete',
                payment_settings: { save_default_payment_method: 'on_subscription' },
                expand: ['latest_invoice.payment_intent'],
                trial_period_days:trialDay,
            });

            res.status(200).json({
                status:true,
                subscription,
                subscriptionId: subscription.id,
                
            });
            
        }catch(error:any){
            res.status(503).json({status:false,error:error.message})
        }
    }else{
        res.status(403).json({status:false,error:"Invalid Method"})
    }
}