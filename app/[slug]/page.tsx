"use client";
// pages/[slug].tsx
// pages/[slug].tsx
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CampaignContract from "@/contracts/CampaignContract.json";
import { ethers } from "ethers";

const abi = CampaignContract;

const CampaignDetails = () => {
  const [campaign, setCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const slug = extractSlugFromPathName(pathname);
    if (slug) {
      fetchCampaignDetails(slug);
    }
  }, [pathname]);

  const extractSlugFromPathName = (pathname: string) => {
    const parts = pathname.split("/");
    return parts[parts.length - 1];
  };

  const fetchCampaignDetails = async (slug: string) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractAddress = "0xe01ae21568b412d3f53b8401694b23b15a2b97d9";
      const contract = new ethers.Contract(contractAddress, abi, provider);

      const campaignDetails = await contract.getCampaign(slug);

      const formattedCampaign = {
        owner: campaignDetails[0],
        title: campaignDetails[1],
        description: campaignDetails[2],
        target: campaignDetails[3].toNumber(),
        amountCollected: campaignDetails[4].toNumber(),
        deadline: campaignDetails[5].toNumber(),
        image: campaignDetails[6],
        open: campaignDetails[7],
        funders: campaignDetails[8],
        fundings: campaignDetails[9],
      };

      setCampaign(formattedCampaign);
    } catch (error) {
      console.error("Error fetching campaign details:", error);
    }
  };

  const handleDonate = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contractAddress = "0x94cdb95d1c37b4165a54cdd828c091b1177bb815";
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const amountInEther = parseFloat(donationAmount);
      if (isNaN(amountInEther)) {
        console.error("Invalid donation amount");
        return;
      }

      // Convert the donation amount to BigNumber format
      const amountInWei = ethers.utils.parseUnits(
        amountInEther.toString(),
        "ether"
      );

      const transaction = await contract.donate(amountInWei);

      console.log("Donation transaction:", transaction);
    } catch (error) {
      console.error("Error donating:", error);
    }
  };

  if (!campaign) {
    return <div>Loading...</div>;
  }

  const progress = (campaign.amountCollected / campaign.target) * 100;

  function convertUnixTimestampToDate(unixTimestamp: number) {
    // Multiply by 1000 to convert from seconds to milliseconds
    const date = new Date(unixTimestamp * 1000);
  
    // Get year, month (0-indexed), day, hours, minutes, seconds, milliseconds
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero for single-digit months
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero for single-digit days
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    // Format the date in a common format (YYYY-MM-DD HH:MM:SS)
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  
    return formattedDate;
  }

  return (
    <div>
      <h1>{campaign.title}</h1>
      <p>{campaign.description}</p>
      <p>Owner: {campaign.owner}</p>
      <p>Target: {campaign.target}</p>
      <p>Amount Collected: {campaign.amountCollected}</p>
      <progress value={progress} max="100"></progress>
      <p>Deadline: {convertUnixTimestampToDate(campaign.deadline)}</p>
      <input
        type="number"
        value={donationAmount}
        onChange={(e) => setDonationAmount(e.target.value)}
        placeholder="Enter donation amount (ETH)"
      />
      <button onClick={handleDonate}>Donate</button>
    </div>
  );
};

export default CampaignDetails;
