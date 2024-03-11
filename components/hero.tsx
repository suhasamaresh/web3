import React from "react";
import Image from "next/image";

const hero = () => {
  return (
    <div className="bg-gradient-to-r pt-10 px-24 from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% h-[600px]">
      <div className="">
        <div className="flex flex-col space-y-3 lg:space-y-9 text-left text-6xl ">
          <h1>The</h1>
          <h1>Best Web3</h1>
          <h1 className="">Crowdfunding</h1>
          <h1>Platform</h1>
          <h3 className="text-lg">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus<br/>
            provident aperiam qui, nulla ipsum id placeat fuga numquam, tenetur<br/>
            perferendis consequatur? Quo at quis vero omnis dolorum laboriosam<br/>
            temporibus architecto.
          </h3>
        </div>
      </div>
    </div>
  );
};

export default hero;
