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
          ? "bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% items-center"
          : "bg-[#090909] items-center"
      }  p-4`}
    >
      <Link href="/">
        <div className="w-10 h-10 p-2 bg-[#1c1c24] rounded-lg">
          <img src="/1.png" alt="logo" className=" bg-[#1c1c24] " />
        </div>
      </Link>
      <div className="container flex justify-between items-center px-24 py-4 fixed top-0 ">
        <div className="hidden md:flex items-center relative">
          <input
            type="text"
            placeholder="search for campaigns"
            className="px-10 py-2 mr-4 rounded-full placeholder:text-white placeholder:text-left placeholder:text-sm  bg-[#1c1c24] focus:outline-none bg- text-white"
          />
          <button className="absolute rounded-full right-5 top-1 bg-emerald-600 text-white hover:bg-indigo-500  font-medium py-2 px-4 ">
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
              <span className="transition ease-in-out delay-150 font-bold  bg-emerald-600 text-[#F7F7F2]  hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 font-poppins px-4 py-3 rounded-full">
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
