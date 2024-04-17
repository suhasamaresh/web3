"use client";
import React from "react";

const Footer = () => {
  const handleGithubClick = () => {
    window.open("https://github.com/suhasamaresh/web3", "_blank");
  };

  return (
    <footer className="bg-[#090909] text-emerald-600 py-4 px-6 sm:px-24 pt-20 border-t-emerald-600 border-t">
      <div className="container mx-auto lg:grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-x-8 flex lg:flex-none">
        <div className="flex flex-col items-center">
          <a href="#" className="hover:underline mb-2 sm:mb-4 sm:text-lg">
            Home
          </a>
          <a href="#" className="hover:underline mb-2 sm:mb-4 sm:text-lg">
            About
          </a>
          <button
            className="hover:underline mb-2 sm:mb-4 sm:text-lg"
            onClick={handleGithubClick}
          >
            Github
          </button>
        </div>
        <div className="flex flex-col items-center">
          <a href="#" className="hover:underline mb-2 sm:mb-4 sm:text-lg">
            Terms & Conditions
          </a>
          <a href="#" className="hover:underline mb-2 sm:mb-4 sm:text-lg">
            Privacy Policy
          </a>
        </div>
        <div className="flex flex-col items-center">
          <a href="#" className="hover:underline mb-2 sm:mb-4 sm:text-lg">
            Motivation
          </a>
          <a href="#" className="hover:underline mb-2 sm:mb-4 sm:text-lg">
            Newsletter
          </a>
        </div>
      </div>
      <div className="container mx-auto mt-4 text-center">
        <p className="text-sm">
          &copy; 2024 Your Company. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
