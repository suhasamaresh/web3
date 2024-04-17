"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import CampaignContract from "@/contracts/CampaignContract.json";

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const abi = CampaignContract;

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        const contractAddress = "0x11fdb66b6b6ff3d573dc79cb4dc2634150037f73";
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const campaigns = await contract.getCampaigns();
        const campaignsData = await Promise.all(
          campaigns.map(async (campaign: any[], index: any) => {
            return {
              id: index,
              title: campaign[1],
              description: campaign[2],
              target: campaign[3].toString(),
              amountCollected: campaign[4].toString(),
              deadline: campaign[5].toString(),
              image: campaign[6],
              open: campaign[7],
            };
          })
        );

        setCampaigns(campaignsData as any);
      } catch (error: any) {
        console.error("Error fetching campaigns:", error);
      }
    };

    fetchCampaigns();
  }, []);

  useEffect(() => {
    setFilteredCampaigns(
      campaigns.filter((campaign ) =>
        (campaign as any).title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, campaigns]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleCampaignClick = (campaignId: any) => {
    router.push(`/browse/${campaignId}`);
    setSearchQuery("");
  };

  return (
    <nav className="bg-[#090909] fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-0 py-4">
        <div className="flex items-center">
          <Link href="/">
            <div className="cursor-pointer ml-5">
              <div className="w-10 h-10 p-2 bg-[#1c1c24] rounded-lg mr-2">
                <img src="/1.png" alt="logo" className="h-full" />
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center ml-9">
            <input
              type="text"
              placeholder="Search for campaigns"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 mr-4 rounded-full placeholder-white bg-[#1c1c24] focus:outline-none text-white"
            />
            <button className="rounded-full bg-emerald-600 text-white hover:bg-indigo-500 font-medium py-2 px-4">
              <FaSearch />
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <ul className="hidden md:flex space-x-7 text-white items-center">
            <li>
              <Link href="/browse">
                <span className="hover:text-grey hover:text-opacity-20 font-poppins text-lg font-medium">
                  Browse Campaigns
                </span>
              </Link>
            </li>
            <li>
              <Link href="/create">
                <span className="transition mr-4 ease-in-out delay-150 font-bold bg-emerald-600 text-[#F7F7F2] hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 font-poppins px-4 py-3 rounded-full">
                  Create campaign
                </span>
              </Link>
            </li>
          </ul>

          <button
            className="md:hidden focus:outline-none ml-4"
            onClick={toggleMenu}
          >
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
          </button>
        </div>
      </div>

      {isOpen && (
        <ul className="md:hidden bg-[#1c1c24] text-white w-full mt-2 items-center">
          <li>
            <div className="flex items-center">
            <input
              type="text"
              placeholder="Search for campaigns"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 mr-4 rounded-full placeholder-white bg-white focus:outline-none placeholder:text-black text-black"
            />
            <FaSearch className="w-6 h-6" /></div>
          </li>
          <li>
            <Link href="/">
              <div className="block py-2 px-4 hover:text-gray-400">Home</div>
            </Link>
          </li>
          <li>
            <Link href="/browse-campaigns">
              <div className="block py-2 px-4 hover:text-gray-400">
                Browse Campaigns
              </div>
            </Link>
          </li>
          <li>
            <Link href="/create">
              <div className="block py-2 px-4 hover:text-gray-400">Create Campaigns</div>
            </Link>
          </li>
        
        </ul>
      )}

      {searchQuery && (
        <div className="absolute top-[calc(100%+10px)] left-0 w-[350px] ml-28 bg-white rounded-lg shadow-lg overflow-hidden">
          {filteredCampaigns.length === 0 ? (
            <div className="px-4 py-2">No campaigns found</div>
          ) : (
            filteredCampaigns.map((campaign: { id: string }) => (
              <div
                key={campaign.id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleCampaignClick(campaign.id)}
              >
                {(campaign as any).title}
              </div>
            ))
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
