import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import {
  CardCvcElement,
  CardElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

const pay = ({ prices, customer }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [form, setFomr] = useState(false);
  const [openCardCvc, setOpenCardCvc] = useState(false);
  const [cvc, setCvc] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [subscriptionId, setSubscriptionId] = useState('');
  const { query } = useRouter();

  useEffect(() => {
    const { subscription } = JSON.parse(localStorage.getItem('subscription'));
    const client_secret =
      subscription.latest_invoice.payment_intent?.client_secret;
    setClientSecret(client_secret);
    setSubscriptionId(subscription.id);
  });

  const handlePay = async () => {
    if (!stripe || !elements) {
      return;
    }
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        name: 'Nazim',
        email: 'nazimhossaindpi@gmail.com',
      },
    });

    if (error) {
      console.log(error);
    }
    const { id } = paymentMethod;
    console.log(paymentMethod);
    const { paymentIntent } = await fetch(`/api/stripe/paymentIntent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: prices.unit_amount,
        paymentMethdoId: id,
        customer: customer.id,
      }),
    }).then((res) => res.json());

    const { client_secret, status } = paymentIntent;
    console.log(paymentIntent);

    if (status === 'requires_confirmation') {
      stripe.confirmCardPayment(client_secret).then((res) => console.log(res));
    } else {
      console.log(status);
    }
  };

  const handlePayExistingCards = async () => {
    if (!stripe || !elements) {
      return;
    }
    const { default_payment_method } = customer.invoice_settings;

    const { paymentIntent } = await fetch(`/api/stripe/paymentIntent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: prices.unit_amount,
        paymentMethdoId: default_payment_method,
        customer: customer.id,
      }),
    }).then((res) => res.json());

    const { client_secret, status } = paymentIntent;

    if (status === 'requires_confirmation') {
      stripe
        .confirmCardPayment(client_secret, {
          payment_method: default_payment_method,
        })
        .then((res) => {
          console.log(res);
          alert('success');
          if (res.error) {
            alert('error');
            console.log(res.error);
          }
        });
    }
  };

  const handleSubscriptionPay = async () => {
    if (!stripe || !elements) {
      return;
    }
    const res = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'Nazim',
          },
        },
      })
      .then((result) => result);
    console.log(res.paymentIntent);

    const { subscription } = await fetch(`/api/stripe/getSubscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
      }),
    }).then((res) => res.json());
    console.log(subscription);
    if (subscription.id) {
      const newSubscription = { priceId: query.id, subscription };
      localStorage.setItem('subscription', JSON.stringify(newSubscription));
    }
  };

  return (
    <div>
      {openCardCvc && (
        <div className="min-h-screen min-w-screen flex justify-center items-center">
          <div className="w-[400px] h-[150px]  bg-white shadow-md rounded-md p-5">
            <input
              className="border p-3 rounded-md mb-5 w-full outline-none"
              placeholder="Enter Card CVC"
            />
            <button
              onClick={handlePayExistingCards}
              disabled={!stripe || !cvc}
              className="bg-green-500 w-full disabled:bg-gray-400 p-3 font-bold text-white rounded-md shadow-sm"
            >
              Pay ${prices.unit_amount / 100}
            </button>
          </div>
        </div>
      )}
      {!form ? (
        <div className="space-x-5">
          <button
            onClick={() => setFomr(true)}
            className="bg-green-500 px-4 py-3 w-52 font-bold text-white rounded-md shadow-sm"
          >
            New Card Pay ${prices.unit_amount / 100}
          </button>
          <button
            onClick={() => setOpenCardCvc(true)}
            className="bg-green-500 px-4 py-3 w-52 font-bold text-white rounded-md shadow-sm"
          >
            Existing Pay ${prices.unit_amount / 100}
          </button>
        </div>
      ) : (
        <div className="min-h-screen min-w-screen flex justify-center items-center">
          <div className="w-[400px] h-[150px]  bg-white shadow-md rounded-md p-5">
            <CardElement className="border p-3 rounded-md mb-5" />
            <button
              onClick={handleSubscriptionPay}
              disabled={!stripe}
              className="bg-green-500 w-full disabled:bg-gray-400 p-3 font-bold text-white rounded-md shadow-sm"
            >
              Pay ${prices.unit_amount / 100}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default pay;

export async function getServerSideProps(context) {
  const { id } = context.query;

  const { prices } = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/getSinglePrice`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: id,
      }),
    }
  ).then((res) => res.json());

  const { customer } = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/getCustomer`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId: 'cus_MqDIrBwq3gYlAC',
      }),
    }
  ).then((res) => res.json());

  return {
    props: { prices, customer }, // will be passed to the page component as props
  };
}

// const getTokendIds = JSON.parse(localStorage.getItem('tokensIds'));
// const getTokenId = getTokendIds.find(
//   (item: { tokenId: string; cardId: string }) =>
//     item.cardId === customer.default_source
// );
// console.log(getTokenId, customer.default_source);

// const { error, paymentMethod } = await stripe.createPaymentMethod({
//   type: 'card',
//   card: { token: getTokenId.tokenId },
// });

// if (error) {
//   console.log(error);
// }
