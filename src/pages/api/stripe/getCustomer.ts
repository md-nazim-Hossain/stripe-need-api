
const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async (req:any, res:any) => {
    if(req.method === 'POST'){
        const {customerId} = req.body
        try{
            const customer = await stripe.customers.retrieve(customerId);
            res.status(200).json({status:true,customer})
            
        }catch(error:any){
            res.status(503).json({status:false,error:error.message})
        }
    }else{
        res.status(403).json({status:false,error:"Invalid Method"})
    }
}