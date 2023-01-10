const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);
// tok_1M70GEAHNLwHVRaT3RvdQW25
export default async (req: any, res: any) => {
//   if (req.method === 'POST') {
    try {
        const token = await stripe.tokens.retrieve('tok_1M70GEAHNLwHVRaT3RvdQW25');

       res.status(200).json({status: true,token});
    } catch (error: any) {
      res.status(503).json({ status: false, error: error.message });
    }
  } 
//   else {
//     res.status(403).json({ status: false, error: 'Invalid Method' });
//   }
// };
