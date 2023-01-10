
const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async (req:any, res:any) => {
    if(req.method === 'POST'){
        const {customerId,paymentMethodId} = req.body
        try{
           const paymentMethods = await stripe.customers.listPaymentMethods(customerId,{type: 'card'});
           const paymentMethod = paymentMethods.data.find((item)=>item.id === paymentMethodId)
            if(paymentMethod){
                res.status(200).json({status:true,paymentMethod})
            }else{
                res.status(404).json({status:false,error:"PaymentMethod Id Not Founds"})
            }
            
        }catch(error:any){
            res.status(503).json({status:false,error:error.message})
        }
    }else{
        res.status(403).json({status:false,error:"Invalid Method"})
    }
}