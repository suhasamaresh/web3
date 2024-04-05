"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHomePage, setIsHomePage] = useState(true); 

 
  const handlePageChange = () => {
    setIsHomePage(window.location.pathname === "/");
  };

  useEffect(() => {
    handlePageChange();

    const unlisten = () => {
      window.removeEventListener("popstate", handlePageChange);
      window.removeEventListener("pushState", handlePageChange);
    };

    window.addEventListener("popstate", handlePageChange);
    window.addEventListener("pushState", handlePageChange);

    return unlisten;
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav
      className={`${
        isHomePage
          ? "bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%"
          : "bg-emerald-500"
      } pt-10 p-4`}
    >
      <div className="container flex justify-between items-center px-24 py-2 fixed top-0 w-full z-50">
        <div className="flex items-center">
          <Link href={"/"}>
            <img
              className="h-8 w-8 mr-2"
              src="https://www.shutterstock.com/search/fund-logo" 
              alt="Fundlt Logo"
            />
          </Link>
          <Link
            className="text-white text-3xl font-bold font-poppins"
            href={"/"}
          >
            Fundlt
          </Link>
        </div>

        <div className="hidden md:flex items-center relative">
          <input
            type="text"
            placeholder="search for campaigns"
            className="px-10 py-2 mr-4 border rounded-full placeholder:text-white placeholder:text-left placeholder:text-sm border-gray-300  focus:outline-none bg-transparent text-white"
          />
          <button className="absolute rounded-full right-5 top-1 bg-[#005F69] text-white hover:bg-indigo-500  font-medium py-2 px-4 border border-transparent ">
            <FaSearch />
          </button>
        </div>

        <ul className="hidden md:flex space-x-7 text-white items-center">
          <li>
            <Link href="/">
              <span className="hover:text-black hover:text-opacity-20 font-poppins text-lg font-medium ">
                Home
              </span>
            </Link>
          </li>
          <li>
            <Link href="/browse">
              <span className="hover:text-black hover:text-opacity-20 font-poppins text-lg font-medium ">
                Browse Campaigns
              </span>
            </Link>
          </li>
          <li>
            <Link href="/create">
              <span className="transition ease-in-out delay-150 font-bold  bg-[#005F69] text-[#F7F7F2]  hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 font-poppins px-4 py-3 rounded-full">
                Create campaign
              </span>
            </Link>
          </li>
          
        </ul>

        <button className="md:hidden focus:outline-none" onClick={toggleMenu}>
          <svg
            className="h-6 w-6 text-white"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M4 6H20M4 12H20M4 18H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
          {isOpen ? (
            <ul className="md:hidden ${isOpen ? 'block' : 'hidden'} absolute top-full left-0 bg-transparent w-full">
              <li>
                <Link href="/">
                  <span className="block py-2 px-4 hover:text-gray-400 font-poppins">
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/browse-campaigns">
                  <span className="block py-2 px-4 hover:text-gray-400 font-poppins">
                    Browse Campaigns
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/donate">
                  <span className="block py-2 px-4 hover:text-gray-400 font-poppins">
                    Donate
                  </span>
                </Link>
              </li>
              <li>
                <button className="rounded-full bg-[#F7F7F2] text-[#005F69] px-4 py-2 font-poppins">
                  Login
                </button>
              </li>
            </ul>
          ) : null}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
