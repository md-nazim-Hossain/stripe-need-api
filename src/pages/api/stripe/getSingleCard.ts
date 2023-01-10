const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async (req: any, res: any) => {
  if (req.method === 'POST') {
   const {customerId,cardId} = req.body;
    try {
        const card = await stripe.customers.retrieveSource(
            customerId,
            cardId
        );

       res.status(200).json({status: true,card});
    } catch (error: any) {
      res.status(503).json({ status: false, error: error.message });
    }
  } else {
    res.status(403).json({ status: false, error: 'Invalid Method' });
  }
};
