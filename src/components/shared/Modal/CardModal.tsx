import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

type Props = {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
};

function CardModal({ setOpenModal }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [valid, setValid] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  useEffect(() => {
    const customerId = JSON.parse(localStorage.getItem('customerId'));
    setCustomerId(customerId);
  }, []);

  const handleSaveCard = async () => {
    if (!stripe || !elements) {
      return;
    }
    const cardElement = elements.getElement(CardElement);

    const { token, error } = await stripe.createToken(cardElement);
    if (error) {
      console.log(error);
    }
    let { id, card } = token;
    const res = await fetch('/api/stripe/saveCard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tokenId: id,
        customerId,
      }),
    }).then((res) => res.json());
    setOpenModal(false);

    if (id && typeof window !== 'undefined') {
      const tokenIds = JSON.parse(localStorage.getItem('tokensIds'));
      if (tokenIds) {
        const newTokesIds = [...tokenIds, { tokenId: id, cardId: card.id }];
        localStorage.setItem('tokensIds', JSON.stringify(newTokesIds));
      } else {
        const data = [{ tokenId: id, cardId: card.id }];
        localStorage.setItem('tokensIds', JSON.stringify(data));
      }
      alert('Save Tokens and Card In Localstorage');
    } else {
      console.log('Something problem');
    }
  };

  const handleSaveCardWithSources = async () => {
    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);

    const { source, error } = await stripe.createSource(card, {
      type: 'card',
      currency: 'usd',
      owner: {
        name: 'Jenny Rosen',
      },
    });
    if (error) {
      console.log(error);
    }

    console.log(source.id);
    const res = await fetch('/api/stripe/saveCard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tokenId: source.id,
        customerId,
      }),
    }).then((res) => res.json());

    console.log(res.source);
  };

  const handleCardSaveWithPaymentMethod = async () => {
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
      metadata: {
        cvcCode: cardCvc,
      },
    });

    if (error) {
      console.log(error);
    }
    const res = await fetch('/api/stripe/attachedCard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentMethodId: paymentMethod.id,
        customerId,
      }),
    }).then((res) => res.json());
    setOpenModal(false);
    console.log(res);
  };

  return (
    <div className="h-screen w-screen bg-gray-600/60 absolute top-0 left-0 flex justify-center items-center">
      <div className="w-[500px] h-[285px] bg-white shadow-md rounded-md p-5 relative">
        <span
          className="absolute top-5 right-5 font-bold cursor-pointer flex justify-center items-center w-8 h-8 rounded-full bg-gray-100"
          onClick={() => setOpenModal(false)}
        >
          X
        </span>
        <h1 className="font-bold text-xl text-center mb-5">Saving Card Info</h1>

        <CardElement
          onChange={(e) => {
            if (e.complete || e.empty) {
              setValid(true);
            } else {
              setValid(false);
            }
          }}
          className="border p-4 rounded-md"
        />

        <input
          onChange={(e) => setCardCvc(e.target.value)}
          className="border p-3 rounded-md outline-none mt-5 w-full"
          placeholder="Enter CVC Code"
          max={4}
          min={3}
        />

        <button
          onClick={handleCardSaveWithPaymentMethod}
          disabled={!stripe || !valid || !cardCvc}
          className="mt-5 p-3 bg-green-500 disabled:bg-gray-400 text-white font-semibold rounded-md w-full"
        >
          Save Card
        </button>
      </div>
    </div>
  );
}

export default CardModal;
