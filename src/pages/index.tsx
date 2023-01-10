import React, { useEffect, useState } from 'react';

import { NextPage } from 'next';

import AttachedCard from '@components/CustomeSubscription/Card/AttachedCard';
import Products from '@components/CustomeSubscription/Products/Products';
import CardModal from '@components/shared/Modal/CardModal';

const Home: NextPage = ({ products, prices }: any) => {
  const [register, setRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [cards, setCards] = useState<any[]>();

  const [activeCard, setActiveCard] = useState('');
  let getCustomer: string;

  useEffect(() => {
    getCustomer = JSON.parse(localStorage.getItem('customerId'));
    if (getCustomer) {
      setRegister(false);
    } else {
      setRegister(true);
    }
  }, [register]);

  useEffect(() => {
    const handleCards = async () => {
      const { customerPaymentMethods } = await fetch(
        `/api/stripe/getAttachedCard`,
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
      setCards(customerPaymentMethods.data);
      // const { cards } = await fetch(`/api/stripe/getAllCards`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     customerId: 'cus_MqDIrBwq3gYlAC',
      //   }),
      // }).then((res) => res.json());
      // setCards(cards.data);
    };
    handleCards();
  }, [activeCard]);

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/stripe/createCustomer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
      }),
    }).then((res) => res.json());

    const { id } = res.customers;

    if (id) {
      localStorage.setItem('customerId', JSON.stringify(id));
      setRegister(false);
    }
  };

  return (
    <div>
      {register ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <form
            onSubmit={handleCreateCustomer}
            className="w-[40%] h-[400px] shadow-md rounded-md bg-gray-200 p-10"
          >
            <div className="flex flex-col mb-5">
              <label className="font-semibold mb-1">Name</label>
              <input
                onChange={(e) => setName(e.target.value)}
                className="p-3 rounded-md outline-none"
                placeholder="Enter Your Name"
              />
            </div>
            <div className="flex flex-col mb-5">
              <label className="font-semibold mb-1">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type={'email'}
                className="p-3 rounded-md outline-none"
                placeholder="Enter Your Email"
              />
            </div>
            <button
              disabled={!email || !name}
              className="w-full bg-blue-600 disabled:bg-gray-400 font-semibold p-3 rounded-md text-white mt-10"
            >
              Register
            </button>
          </form>
        </div>
      ) : (
        <Products products={products.data} prices={prices.data} />
      )}

      <button
        onClick={() => setOpenModal(true)}
        className=" mt-10 bg-gray-100 p-3 rounded-md font-bold text-green-600"
      >
        Attached Card
      </button>

      {openModal && <CardModal setOpenModal={setOpenModal} />}

      <div className="my-20 grid grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-4">
        {cards?.map((card, index) => {
          return (
            <AttachedCard
              attachedCard={card}
              key={index}
              activeCard={activeCard}
              setActiveCard={setActiveCard}
            />
            // <Card
            //   card={card}
            //   key={index}
            //   activeCard={activeCard}
            //   setActiveCard={setActiveCard}
            // />
          );
        })}
      </div>
    </div>
  );
};

export default Home;

export async function getServerSideProps(context) {
  const { products } = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/getAllProducts`
  ).then((res) => res.json());

  const { prices } = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/getAllPrices`
  ).then((res) => res.json());

  return {
    props: { products, prices }, // will be passed to the page component as props
  };
}
