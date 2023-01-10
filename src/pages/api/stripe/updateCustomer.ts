
const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async (req:any, res:any) => {
    if(req.method === 'POST'){
        const {customerId,defaultPaymentMethod} = req.body
        try{
            const customer = await stripe.customers.update(customerId,
                {
                    invoice_settings:{
                        default_payment_method:defaultPaymentMethod
                    }
                }
            );
            res.status(200).json({status:true,customer})
            
        }catch(error:any){
            res.status(503).json({status:false,error:error.message})
        }
    }else{
        res.status(403).json({status:false,error:"Invalid Method"})
    }


}

// update customer with sources and tokenid
// export default async (req:any, res:any) => {
//     if(req.method === 'POST'){
//         const {customerId,sourceId} = req.body
//         try{
//             const customer = await stripe.customers.update(customerId,
//                 {
//                     default_source:sourceId
//                 }
//             );
//             res.status(200).json({status:true,customer})
            
//         }catch(error:any){
//             res.status(503).json({status:false,error:error.message})
//         }
//     }else{
//         res.status(403).json({status:false,error:"Invalid Method"})
//     }
// }