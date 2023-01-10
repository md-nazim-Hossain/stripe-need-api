import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { setSubscriptionDetails } from '@services/redux/Slice/SubscriptionSlice';
import { useAppDispatch, useAppSelector } from '@services/redux/store/store';

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [subscriptionStatus, setSubscriptionStatus] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const subscription = JSON.parse(localStorage.getItem('subscription'));
    dispatch(setSubscriptionDetails(subscription));
    const handleSub = async () => {
      const { subscription: retrive } = await fetch(
        '/api/stripe/getSubscription',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscriptionId: subscription?.subscription.id,
          }),
        }
      ).then((res) => res.json());

      if (retrive?.id) {
        localStorage.setItem(
          'subscription',
          JSON.stringify({
            priceId: subscription.priceId,
            subscription: retrive,
          })
        );
      }
    };
    handleSub();
    if (subscription) {
      const { id, current_period_end, status, trial_end } =
        subscription?.subscription;
      if (id && current_period_end * 1000 > Date.now()) {
        setSubscriptionStatus(true);
      }
      if (
        trial_end * 1000 < Date.now() ||
        current_period_end * 1000 < Date.now()
      ) {
        // router.push(`/payment/${subscription.priceId}`);
      }
      if (status !== 'active') {
        // router.push(`/payment/${subscription.priceId}`);
      }
    }
  }, [subscriptionStatus]);
  return (
    <div className="container">
      <Elements stripe={stripe}>{children}</Elements>
    </div>
  );
};

export default Layout;
