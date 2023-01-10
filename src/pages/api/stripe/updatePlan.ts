const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async (req: any, res: any) => {
  if (req.method === 'POST') {
    const { subscriptionId, priceId } = req.body;
    try {
       const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const updateSubscription = await stripe.subscriptions.update( subscriptionId,{
        items: [
          {
            id: subscription.items.data[0].id,
            price: priceId,
          },
        ],
        cancel_at_period_end: false,
      });

      res.status(200).json({
        status: true,
        updateSubscription,
        subscriptionId: updateSubscription.id,
      });
    } catch (error: any) {
      res.status(503).json({ status: false, error: error.message });
    }
  } else {
    res.status(403).json({ status: false, error: 'Invalid Method' });
  }
};
