import React, { useEffect, useState } from 'react';

const ProductDisplay = () => (
  <section className="w-1/3 mx-auto border mt-10 rounded-lg overflow-hidden">
    <div className="flex items-center gap-x-5 bg-white p-5">
      <img
        src="https://i.imgur.com/EHyR2nP.png"
        alt="The cover of Stubborn Attachments"
        className="w-[100px] object-cover"
      />
      <div className="flex-1">
        <h3>Stubborn Attachments</h3>
        <h5>$100.00</h5>
      </div>
    </div>
    <form action="/api/stripe/oneTimePay" method="POST">
      <button type="submit" className="bg-blue-400 text-white w-full px-5 py-2">
        Checkout
      </button>
    </form>
  </section>
);

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function OneTimePay() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get('success')) {
      setMessage('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);

  return message ? <Message message={message} /> : <ProductDisplay />;
}
//hello
