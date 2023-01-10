
const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async (req:any, res:any) => {
    if (req.method === 'POST') {
        
        try{
           const session = await stripe.checkout.sessions.create({
                customer_email: 'customer@example.com',
                billing_address_collection: 'auto',
                shipping_address_collection: {
                allowed_countries: ['US', 'CA','BD'],
                },
                line_items: [
                {
                    price: 'price_1M7Kc5AHNLwHVRaTiSBwFIH8',
                    quantity: 1,
                },
                ],
                mode: 'subscription',
                success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?success=true`,
                cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel?canceled=true`,
            });

            res.redirect(303, session.url);
            
        }catch(error:any){
            res.status(503).json({status:false,error:error.message})
        }
    } else {
        res.status(403).json({ status: false, error: 'Invalid Method' });
  }
}