import React from "react";

const Hero = () => {
  return (
    <div className="bg-[#090909] pt-16 px-8 lg:px-32 mt-16">
      <div className=" mx-auto flex flex-col lg:flex-row justify-evenly items-center space-y-8 lg:space-y-0">
        <div className="text-center lg:text-left lg:w-1/2">
          <h1 className="text-white text-5xl lg:text-7xl font-bold">
            The Best Web3 Crowdfunding Platform
          </h1>
          <h3 className="text-lg text-white mt-8 lg:mt-10">
            {" "}
            {/* Increased margin */}
            Introducing the future of crowdfunding: our Web3 platform combines
            cutting-edge blockchain technology with user-friendly design,
            enabling anyone to create, manage, and support campaigns with ease.
            Say goodbye to centralized intermediaries and hello to transparency,
            security, and efficiency.
          </h3>
        </div>
        <div className="flex justify-center lg:w-1/2">
          <img src="/web3.jpg" alt="hero" className="w-full max-w-md" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
