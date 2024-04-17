"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import CrowdFundingContract from "@/contracts/CampaignContract.json";

const Browsec = () => {
  const [campaigns, setCampaigns] = useState([]);
  const abi = CrowdFundingContract; // Import the contract ABI

  useEffect(() => {
    fetchData();
  }, []); // Fetch data only once when component mounts

  const fetchData = async () => {
    try {
      // Your existing code to fetch campaigns from the contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractAddress = "0x11fdb66b6b6ff3d573dc79cb4dc2634150037f73";
      const contract = new ethers.Contract(contractAddress, abi, provider);

      const campaignsArray = await contract.getCampaigns();

      const formattedCampaigns = await Promise.all(
        campaignsArray.map(async (campaign, index) => {
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
      formattedCampaigns.sort((a, b) => b.amountCollected - a.amountCollected);
      const slicedCampaigns = window.innerWidth < 640 ? formattedCampaigns.slice(0, 3) : formattedCampaigns.slice(0, 6);
      // Limit to the first six campaigns
      setCampaigns(slicedCampaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error.message);
    }
  };

  return (
    <div className="bg-[#090909] px-6 sm:px-24 pt-5 pb-10">
      <h1 className="text-2xl font-medium font-poppins mb-8 text-white">
        Featured Campaigns
      </h1>
      <div className="container lg:h-[600px] h-[850px] rounded-xl border border-emerald-600">
        <div className="flex flex-wrap justify-center h-full">
          {/* Display campaign cards */}
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="w-full sm:w-1/2 lg:w-1/3 p-2 sm:p-4">
              {/* Render your campaign card component */}
              <Link href={`/browse/${campaign.id}`} key={campaign.id}>
                <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col justify-between">
                  <div>
                    <img
                      src={campaign.image}
                      alt={campaign.title}
                      className="w-full h-32 object-cover mb-2 sm:mb-4"
                    />
                    <h3 className="text-lg font-medium mb-1">{campaign.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-3">
                      {campaign.description}
                    </p>
                  </div>
                  {/* Additional campaign details */}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Browsec;
