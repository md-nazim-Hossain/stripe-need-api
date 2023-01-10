
const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async (req:any, res:any) => {
    if(req.method === 'POST'){
        const {amount,paymentMethdoId,customer} = req.body
        try{
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: 'usd',
                setup_future_usage: 'off_session',
                payment_method:paymentMethdoId,
                metadata: {order_id: '0001'},
                automatic_payment_methods: {
                    enabled: true
                },
                customer
                
            });
            res.status(200).json({status:true,paymentIntent})
            
        }catch(error:any){
            res.status(503).json({status:false,error:error.message})
        }
    }else{
        res.status(403).json({status:false,error:"Invalid Method"})
    }
}