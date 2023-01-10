import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { BsFillCaretRightFill } from 'react-icons/bs';
import { FaWifi } from 'react-icons/fa';
import { FcSimCardChip } from 'react-icons/fc';

type Props = {
  card: any;
  activeCard: string;
  setActiveCard: Dispatch<SetStateAction<string>>;
};

const Card = ({ card, activeCard, setActiveCard }: Props) => {
  useEffect(() => {
    fetch('/api/stripe/getCustomer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId: JSON.parse(localStorage.getItem('customerId')),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setActiveCard(data.customer.default_source);
      });
  }, [activeCard]);

  const handleUpdateCustomer = async (customerId: string, sourceId: string) => {
    const res = await fetch('/api/stripe/updateCustomer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sourceId,
        customerId,
      }),
    }).then((res) => res.json());
    const { default_source } = res.customers;
    setActiveCard(default_source);
  };

  return (
    <div
      onClick={() => handleUpdateCustomer(card.customer, card.id)}
      style={{
        background: `url(/assets/images/${
          card.brand === 'Visa' ? 'card.jpg' : 'master.png'
        })`,
      }}
      className={`w-full h-[230px] bg-[url('/assets/images/card.jpg')] bg-cover border border-transparent cursor-pointer ${
        card.brand === 'Visa' ? 'text-blue-400' : 'text-red-400'
      } shadow-md rounded-md ${
        activeCard === card.id && 'border-blue-500 ring-4 ring-blue-400'
      }`}
    >
      <div className=" p-5">
        <div className="flex justify-between items-center uppercase font-semibold text-lg">
          <span className="">Bank</span>
          <span className="capitalize">{card.funding} Card</span>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <FcSimCardChip size={50} />
          <FaWifi size={45} className="rotate-90" />
        </div>
        <p className="font-bold flex space-x-3 items-center text-xl">
          <span>****</span> <span>****</span> <span>****</span>{' '}
          <span>{card.last4}</span>
        </p>
        <div className="flex space-x-2 items-center justify-center py-1">
          <p className="uppercase text-xs space-x-1 flex items-center">
            <span>
              valid
              <br /> Thru
            </span>
            <BsFillCaretRightFill />
          </p>
          <div className="flex flex-col justify-center">
            <span className="text-xs">Month/Year</span>
            <span className="text-xl font-bold">
              {card.exp_month}/{card.exp_year}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center font-semibold uppercase">
          <p>{card.name ? card.name : 'Jhon Doe'}</p>
          <p>{card.brand}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
