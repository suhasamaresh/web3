// pages/index.tsx (or your Page component)
"use client";
// pages/index.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import CrowdFundingContract from "@/contracts/CampaignContract.json";
import { ethers } from "ethers";
import Sidemenu from "@/components/sidemenu";
import firebase from "firebase/compat/app";
import "firebase/compat/storage"; // Import Firebase storage module

const abi = CrowdFundingContract;

const Page = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const campaignsPerPage = 8;

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractAddress = "0x94cdb95d1c37b4165a54cdd828c091b1177bb815"; // Replace with your actual contract address
      const contract = new ethers.Contract(contractAddress, abi, provider);

      const startIndex = (currentPage - 1) * campaignsPerPage;
      const endIndex = startIndex + campaignsPerPage;

      console.log("Before calling contract.getCampaigns()");
      const campaignsArray = await contract.getCampaigns();
      console.log("After calling contract.getCampaigns()");

      const formattedCampaigns = await Promise.all(
        campaignsArray.slice(startIndex, endIndex).map(async (campaign) => {
          const imageURL = await getImageURLFromFirebase(campaign[6]);
          return {
            owner: campaign[0],
            title: campaign[1],
            description: campaign[2],
            target: campaign[3],
            amountCollected: campaign[4],
            deadline: campaign[5],
            image: imageURL,
            open: campaign[7],
            funders: campaign[8],
            fundings: campaign[9],
          };
        })
      );

      setCampaigns(formattedCampaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const getImageURLFromFirebase = async (imageRef: string) => {
    try {
      // Assuming you have initialized Firebase with appropriate config
      const storageRef = firebase.storage().ref();
      const imageURL = await storageRef.child(imageRef).getDownloadURL();
      return imageURL;
    } catch (error) {
      console.error("Error fetching image from Firebase:", error);
      return ""; // Return empty string if image fetching fails
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div>
      <div>
        <Sidemenu />
      </div>
      <div className="px-4 sm:px-6 lg:pl-24">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold mb-4">Campaigns</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {campaigns.map((camp, index) => (
            <Link key={index} href={`/${index}`}>
              <div className="block">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <img
                    className="w-full h-48 object-cover"
                    src={camp.image}
                    alt={`Campaign ${index}`}
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{camp.title}</h2>
                    <p className="text-gray-700 mb-2">{camp.description}</p>
                    <p className="text-gray-600">Owner: {camp.owner}</p>
                    <p className="text-gray-600">Target: {camp.target}</p>
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
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
            >
              Previous
            </button>
          )}
          {campaigns.length === campaignsPerPage && (
            <button
              onClick={handleNextPage}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
