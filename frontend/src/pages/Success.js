import React from 'react'
import SUCCESSIMAGE from '../assest/success.gif'
import {Link} from 'react-router-dom'

const Success = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 m-10 bg-slate-200 rounded-lg max-w-md mx-auto">
      <img
        className="w-40 h-40 object-cover"
        src={SUCCESSIMAGE}
        alt="Payment Successful"
      />
      <p className="mt-4 text-xl font-bold text-green-600">Payment Successful!</p>
      <Link
        to="/order"
        className="mt-6 px-4 py-2 border-2 border-green-600 text-green-600 font-semibold rounded hover:bg-green-600 hover:text-white transition duration-300"
      >
        See Order
      </Link>
    </div>
  );
};

export default Success;
