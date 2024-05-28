import React from 'react';

const Navbar = () => {
  return (
    <nav className="shadow-md flex justify-between px-28 p-3">
      <h1 className="text-blue-600 text-2xl font-bold">Chatter</h1>
      <button> Logout </button>
    </nav>
  );
};
export default Navbar;
