import React, { useState } from "react";

function Navbar() {
  const [openLinks ] = useState(false);

  return (
    <div className="w-[100%] h-[8vh] bg-[#d5e1ffa9] flex items-center justify-between rounded-lg m-2">
      <div className="flex items-center h-full pl-8">
      <a href="/home" className="text-black no-underline m-5 text-[24px] font-semibold">Marketwatch.ai</a>
      </div>
      <div className="flex items-center justify-end h-full pr-8">
        <a href="/home" className="text-black no-underline m-5 text-[24px] font-semibold">Home</a>
        <a href="/about" className="text-black no-underline m-5 text-[24px] font-semibold">About Us</a>
        <a href="/query" className="text-black no-underline m-5 text-[24px] font-semibold">Query</a>
        <a href="/compare" className="text-black no-underline m-5 text-[24px] font-semibold">Compare</a>
      </div>
      {openLinks && (
        <div className="flex flex-col items-start ml-8 md:hidden">
          <a href="/home" className="text-black no-underline m-5 text-[18px]">Home</a>
          <a href="/about" className="text-black no-underline m-5 text-[18px]">About Us</a>
          <a href="/query" className="text-black no-underline m-5 text-[18px]">Marketwatch.ai</a>
        </div>
      )}
    </div>
  );
}

export default Navbar;
