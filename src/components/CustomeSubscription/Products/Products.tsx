import React, { useEffect } from 'react';

import Link from 'next/link';

import { useAppSelector } from '@services/redux/store/store';

type Props = {
  products: any[];
  prices: any[];
};

const Products = ({ products, prices }: Props) => {
  const { subscription_details } = useAppSelector(
    (state) => state.subscription
  );
  let customerId: string;
  useEffect(() => {
    customerId = JSON.parse(localStorage.getItem('customerId'));
  });
  const handleSubscription = async (
    priceId: string,
    trialDay: null | number
  ) => {
    const res = await fetch('/api/stripe/subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        priceId,
      }),
    }).then((res) => res.json());
    if (res.status) {
      localStorage.setItem(
        'subscription',
        JSON.stringify({ priceId, subscription: res.subscription })
      );
    }
  };

  console.log(subscription_details);

  const updateSubscription = async (
    priceId: string,
    subscriptionId: string
  ) => {
    const res = await fetch('/api/stripe/updatePlan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
        priceId,
      }),
    }).then((res) => res.json());
    console.log(res);
    if (res.status) {
      localStorage.setItem(
        'subscription',
        JSON.stringify({ priceId, subscription: res.updateSubscription })
      );
    }
  };

  const status = subscription_details.subscription?.status;

  const active =
    subscription_details?.subscription?.current_period_end * 1000 > Date.now()
      ? true
      : false;
  const priceId = subscription_details?.priceId;

  const handleCancelSub = async (subscriptionId: string) => {
    const { cancelSub, status } = await fetch(
      '/api/stripe/cancelSubscription',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId,
          priceId,
        }),
      }
    ).then((res) => res.json());

    console.log(cancelSub);

    if (status) {
      alert('true');
      localStorage.setItem(
        'subscription',
        JSON.stringify({ priceId, subscription: cancelSub })
      );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10 max-h-[500px]">
      {products.map((product, index) => {
        const pricesData = prices.filter((item, index) => {
          const data = item.product === product.id && index !== 1;
          return data;
        });

        return (
          <div
            key={index}
            className="bg-white shadow-md p-5 rounded-md flex flex-col justify-between"
          >
            <div>
              <div>
                <img
                  src={product.images[0]}
                  className="w-full h-[230px] rounded-md overflow-hidden object-cover object-left-top"
                />
              </div>
              <div className="py-2">
                <p className="font-medium text-lg">{product.name}</p>
                <p className="text-gray-400">{product.description}</p>
              </div>
              <div>
                {pricesData.map((price, index) => {
                  return (
                    <div key={index}>
                      <div className="flex space-x-3 items-center">
                        <h3 className="font-bold text-[2.5rem]">
                          ${price.unit_amount / 100}
                        </h3>
                        <div className="flex items-center justify-between w-full">
                          <div className="text-gray-400">
                            <p>{price.billing_scheme}</p>
                            <p>per {price.recurring.interval}</p>
                          </div>
                          <button
                            className="text-red-500"
                            onClick={() =>
                              handleCancelSub(
                                subscription_details.subscription?.id
                              )
                            }
                          >
                            Cancel Sub
                          </button>
                        </div>
                      </div>
                      {price.recurring?.trial_period_days !== null ? (
                        <button
                          disabled={active && priceId === price.id}
                          onClick={() => {
                            if (
                              active &&
                              subscription_details.subscription?.id
                            ) {
                              updateSubscription(
                                price.id,
                                subscription_details.subscription?.id
                              );
                            } else {
                              handleSubscription(
                                price.id,
                                price.recurring?.trial_period_days
                              );
                            }
                          }}
                          className="w-full bg-blue-600 disabled:bg-gray-400 text-white rounded-md mt-5 p-3 font-semibold"
                        >
                          {active && priceId === price.id
                            ? 'Active'
                            : 'Start Trial'}
                        </button>
                      ) : (
                        <button
                          disabled={active}
                          onClick={() => {
                            if (
                              active &&
                              subscription_details.subscription?.id
                            ) {
                              updateSubscription(
                                price.id,
                                subscription_details.subscription?.id
                              );
                            } else {
                              handleSubscription(
                                price.id,
                                price.recurring?.trial_period_days
                              );
                            }
                          }}
                          className="w-full bg-blue-600 disabled:bg-gray-400 text-white rounded-md mt-5 p-3 font-semibold"
                        >
                          {active ? status : 'Subscribe'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative">
              {product.name.toLowerCase() === 'exclusive' && (
                <Link href={''}>
                  <button className="w-full bg-blue-600 text-white rounded-md mt-5 p-3 font-semibold">
                    Contact Us
                  </button>
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Products;
