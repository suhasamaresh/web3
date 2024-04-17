"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import CampaignContract from "@/contracts/CampaignContract.json";
import { ethers } from "ethers";
import Sidemenu from "@/components/sidemenu";

const abi = CampaignContract;

const CampaignDetails = () => {
  const [campaign, setCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [currentDonatedAmount, setCurrentDonatedAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const slugFromPathname = extractSlugFromPathName(pathname);
    if (slugFromPathname) {
      setSlug(slugFromPathname);
      fetchCampaignDetails(slugFromPathname);
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    } else {
      console.log("MetaMask not detected");
    }
  }, []);

  useEffect(() => {
    if (campaign) {
      getCurrentDonatedAmount();
    }
  }, [campaign]);

  const extractSlugFromPathName = (pathname: string) => {
    const parts = pathname.split("/");
    return parts[parts.length - 1];
  };

  const fetchCampaignDetails = async (slug: any) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractAddress = "0x11fdb66b6b6ff3d573dc79cb4dc2634150037f73";
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const funders = await contract.getFunders(slug);
      const campaignDetails = await contract.getCampaign(slug);
      const currentDonatedAmount = await contract.getCurrentDonatedAmount(slug);

      const formattedCampaign = {
        owner: campaignDetails[0],
        title: campaignDetails[1],
        description: campaignDetails[2],
        target: campaignDetails[3].toString(),
        amountCollected: campaignDetails[4].toString(),
        deadline: campaignDetails[5].toNumber(),
        image: campaignDetails[6],
        open: campaignDetails[7],
        funders: funders,
        fundings: currentDonatedAmount.toString(),
      };

      setCampaign(formattedCampaign);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching campaign details:", error);
    }
  };

  const getCurrentDonatedAmount = async () => {
    try {
      if (!slug || !campaign) {
        throw new Error("Slug or campaign not available");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractAddress = "0x11fdb66b6b6ff3d573dc79cb4dc2634150037f73";
      const contract = new ethers.Contract(contractAddress, abi, provider);

      const donatedAmountWei = await contract.getCurrentDonatedAmount(slug);
      const donatedAmountEth = ethers.utils.formatEther(donatedAmountWei);

      setCurrentDonatedAmount(Number(donatedAmountEth));
    } catch (error) {
      console.error("Error fetching current donated amount:", error);
    }
  };

  const connectToMetaMask = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      setConnected(true);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };

  const handleDonate = async () => {
    try {
      if (!connected) {
        await connectToMetaMask();
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contractAddress = "0x11fdb66b6b6ff3d573dc79cb4dc2634150037f73";
      const contract = new ethers.Contract(contractAddress, abi, signer);
      

      const amountInEther = parseFloat(donationAmount);
      if (isNaN(amountInEther)) {
        throw new Error("Invalid donation amount");
      }

      const amountInWei = ethers.utils.parseUnits(
        amountInEther.toString(),
        "ether"
      );

      const overrides = {
        value: amountInWei,
      };

      const transaction = await contract.donate(slug, overrides);

      console.log("Donation transaction:", transaction);
    } catch (error) {
      console.error("Error donating:", error.message);
    }
  };

  if (loading) {
    return (
      <button type="button" className="bg-indigo-500 ..." disabled>
        <svg
          className="animate-spin h-5 w-5 mr-3 ..."
          viewBox="0 0 24 24"
        ></svg>
        Processing...
      </button>
    );
  }

  const progress =
    ((campaign.amountCollected + currentDonatedAmount) / campaign.target) * 100;

  function convertUnixTimestampToDate(unixTimestamp: number) {
    const date = new Date(unixTimestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const formattedDate = `${day}-${month}-${year} | ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  }

  const amountcollected = ethers.utils.formatEther(campaign.amountCollected);
  const deadline = convertUnixTimestampToDate(campaign.deadline);

  return (
    <div className="bg-[#090909] mt-16 items-center pb-10">
      <div>
        <Sidemenu />
      </div>
      <div className="lg:pl-28 pt-12">
        <div className="lg:px-28">
          <div className="lg:flex align-middle items-center justify-between">
            <div className="">
              <img
                src={campaign.image}
                alt="Campaign"
                className="w-[750px] h-[350px] rounded-lg pl-20 pr-20 lg:pl-0 lg:pr-0"
              />
            </div>
            <div className="pr-32 pl-20 ml-12 lg:ml-0 lg:pl-0 pt-4 lg:pt-0">
              <div className="">
                <div className="flex flex-col">
                  <p className="text-[#808191] mb-2 bg-[#1c1c24] rounded-lg p-3 text-center">
                    {deadline}
                    <div className="bg-black text-[#808191] rounded-lg text-center py-1">
                      Deadline
                    </div>
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="text-[#808191] mb-2 bg-[#1c1c24] rounded-lg p-3 text-center">
                    {currentDonatedAmount} ETH
                    <div className="bg-black text-[#808191] rounded-lg text-center px-2 py-1">
                      Total raised
                    </div>
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="text-[#808191] mb-2 bg-[#1c1c24] rounded-lg p-3 text-center">
                    {campaign.funders.length}{" "}
                    <div className="bg-black text-[#808191] rounded-lg text-center px-2 py-1">
                      Total Funders
                    </div>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:flex items-center justify-between mt-10 pl-10 pr-10 lg:pl-0 lg:pr-0">
            <div className="mt-10">
              <h1 className="font-poppins font-medium text-white">CREATOR</h1>
              <p className="text-white">{campaign.owner}</p>
              <h1 className="font-poppins font-medium text-white pt-3">
                TITLE
              </h1>
              <p className="text-[#808191]">{campaign.title}</p>
              <h1 className="font-poppins font-medium text-white pt-3">
                DESCRIPTION
              </h1>
              <p className="text-[#808191]">Story: {campaign.description}</p>
              <h1 className="font-poppins font-medium text-white pt-3">
                DONATORS
              </h1>
              <p className="text-[#808191]">
                Funders' Addresses: {campaign.funders.join(", ")}
              </p>
            </div>
            <div className="mt-4 w-[350px] align-middle mr-32 ml-5 lg:ml-0">
              <h1 className="text-white font-semibold mb-4">Fund</h1>
              <div className="bg-[#1c1c24] rounded-xl w-full">
                <h1 className="text-center text-[#808191] py-2 pt-3">
                  Pledge without a reward
                </h1>
                <input
                  type="number"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  placeholder="(ETH)"
                  className="border border-[#808191] ml-6 mr-4 rounded-md px-5 w-[300px] focus:outline-none focus:border-emerald-500 text-black mt-3"
                />
                <div className="bg-black rounded-xl mt-3 px-5 pl-2 pr-2 ml-6 mr-6">
                  <h1 className="text-white font-semibold pt-2">
                    Back it cause you believe it
                  </h1>
                  <p className="text-[#808191] pt-3">
                    Support the project for no reward. Just because it appeals
                    to you
                  </p>
                </div>
                <button
                  onClick={handleDonate}
                  className="text-white font-poppins font-semibold bg-indigo-500 hover:bg-emerald-600 px-5 py-2 rounded-md mt-3 w-[300px] ml-6 mb-3"
                >
                  Donate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
