const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async (req: any, res: any) => {
  if (req.method === 'POST') {
   const {customerId} = req.body;
    try {
        const cards = await stripe.customers.listSources(
            customerId,
            // object source or card
            {object: 'card', limit: 6}
        );

        if(cards){
            res.status(200).json({
                status: true,
                cards
            });
        }else{
            res.status(200).json({
                status: false,
                cards:"Cards Not Found"
            }); 
        }
    } catch (error: any) {
      res.status(503).json({ status: false, error: error.message });
    }
  } else {
    res.status(403).json({ status: false, error: 'Invalid Method' });
  }
};
