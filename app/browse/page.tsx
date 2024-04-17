// Import necessary modules and components
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import CrowdFundingContract from "@/contracts/CampaignContract.json";
import { ethers } from "ethers";
import Sidemenu from "@/components/sidemenu";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";

const abi = CrowdFundingContract;

const firebaseConfig = {
  apiKey: "AIzaSyBCQpxionrawVX5NjhHSkhS-Vh7Fizj0IA",
  authDomain: "web3-61c0d.firebaseapp.com",
  projectId: "web3-61c0d",
  storageBucket: "web3-61c0d.appspot.com",
  messagingSenderId: "395710420340",
  appId: "1:395710420340:web:cddf6505b5bc9cc6678821",
  measurementId: "G-JXTJ7CLHNG",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Page = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("mostRecent"); // Default filter is most recent
  const campaignsPerPage = 8;

  useEffect(() => {
    fetchData();
  }, [currentPage, filter]);

  const fetchData = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      const contractAddress = "0x11fdb66b6b6ff3d573dc79cb4dc2634150037f73";
      const contract = new ethers.Contract(contractAddress, abi, provider);

      const startIndex = (currentPage - 1) * campaignsPerPage;
      const endIndex = startIndex + campaignsPerPage;

      const campaignsArray = await contract.getCampaigns();

      const formattedCampaigns = await Promise.all(
        campaignsArray.map(async (campaign: any[], index: any) => {
          return {
            id: index, // Assuming the index is the campaign ID
            owner: campaign[0],
            title: campaign[1],
            description: campaign[2],
            target: campaign[3].toString(),
            amountCollected: ethers.utils.formatEther(campaign[4]),
            deadline: campaign[5].toString(),
            image: campaign[6],
            open: campaign[7],
            funders: campaign[8],
            fundings: campaign[9],
            creationTimestamp: campaign[10], // Assuming creationTimestamp is at index 10
          };
        })
      );

      // Sort campaigns based on the selected filter
      if (filter === "mostRecent") {
        formattedCampaigns.sort(
          (a, b) => b.creationTimestamp - a.creationTimestamp
        );
      } else if (filter === "mostPopular") {
        formattedCampaigns.sort(
          (a, b) => b.amountCollected - a.amountCollected
        );
      }

      setCampaigns((formattedCampaigns as any).slice(startIndex, endIndex));
    } catch (error: any) {
      console.error("Error fetching campaigns:", error.message);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleFilterChange = (selectedFilter: any) => {
    setFilter(selectedFilter);
  };

  return (
    <div className="bg-[#090909] mt-16 lg:pb-12">
      <div>
        <Sidemenu />
      </div>
      <div className="px-4 sm:px-6 lg:pl-28">
        <div className="flex justify-between">
          <h1 className="text-2xl pt-2 font-bold mb-4 text-[#F7F7F2] font-poppins">
            All Campaigns
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-white font-semibold font-poppins">
              Filter by:
            </span>
            <select
              className="text-white bg-emerald-600 rounded-2xl p-2 focus:outline-none"
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="mostRecent">Most Recent</option>
              <option value="mostPopular">Most Popular</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:h-screen">
          {campaigns.map((camp, index) => (
            <Link key={index} href={`/browse/${(camp as any).id}`}>
              <div className="block">
                <div className="bg-[#1c1c24] rounded-xl overflow-hidden shadow-lg border-emerald-600 border-2 focus:outline-none hover:border-[#808191]">
                  <img
                    className="w-full sm:h-48 h-32 object-cover rounded-xl"
                    src={(camp as any).image}
                    alt={`Campaign ${index}`}
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2 text-white overflow-hidden whitespace-nowrap overflow-ellipsis">
                      {(camp as any).title}
                    </h2>
                    <div className="h-10 overflow-hidden">
                      <p className="text-[#808191] ">{(camp as any).description}</p>
                    </div>
                    <p className="text-[#808191]">
                      <span className="text-white font-semibold">Owner:</span>{" "}
                      {(camp as any).owner}
                    </p>
                    <div className="flex justify-between">
                      <div className="text-[#808191] flex flex-col">
                        <p className="text-white font-semibold">
                          Amount amountCollected:
                        </p>
                        <p className="text-[#808191]">{(camp as any).amountCollected}</p>
                      </div>
                      <div className="text-[#808191] flex flex-col">
                        <p className="text-white font-semibold">Target:</p>{" "}
                        <p>{(camp as any).target}</p>
                      </div>
                    </div>
                    <p className="text-[#808191] mt-1 hover:text-emerald-600">
                      See more...
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          {currentPage > 1 && (
            <button
              onClick={handlePreviousPage}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4 lg:mt-40 mb-4"
            >
              Previous
            </button>
          )}
          {campaigns.length === campaignsPerPage && (
            <button
              onClick={handleNextPage}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded lg:mt-40 mb-4"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
