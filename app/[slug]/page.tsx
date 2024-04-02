"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import CampaignContract from "@/contracts/CampaignContract.json";
import { ethers } from "ethers";

const abi = CampaignContract;

const CampaignDetails = () => {
  const [campaign, setCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [currentDonatedAmount, setCurrentDonatedAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState(""); // Define slug state here
  const pathname = usePathname();

  useEffect(() => {
    const slugFromPathname = extractSlugFromPathName(pathname);
    if (slugFromPathname) {
      setSlug(slugFromPathname); // Set the slug state when the pathname changes
      fetchCampaignDetails(slugFromPathname);
    }
  }, [pathname]);

  useEffect(() => {
    // Check if MetaMask is installed
    if (window.ethereum) {
      // Handle user switching accounts
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    } else {
      console.log("MetaMask not detected");
    }
  }, []);

  useEffect(() => {
    if (campaign) {
      // Call getCurrentDonatedAmount to get the current donated amount
      getCurrentDonatedAmount();
    }
  }, [campaign]); // Call this effect whenever campaign changes

  const extractSlugFromPathName = (pathname: string) => {
    const parts = pathname.split("/");
    return parts[parts.length - 1];
  };

  const fetchCampaignDetails = async (slug: string) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractAddress = "0xf4b61b64d24cbf0c815730a181a5e0a19967cf2d";
      const contract = new ethers.Contract(contractAddress, abi, provider);
       
      console.log(slug);

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
      setLoading(false); // Set loading to false once campaign details are fetched
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
      const contractAddress = "0xf4b61b64d24cbf0c815730a181a5e0a19967cf2d";
      const contract = new ethers.Contract(contractAddress, abi, provider);
      console.log(slug);

      // Access the slug state here
      const donatedAmount = await contract.getCurrentDonatedAmount(slug);

      if (donatedAmount !== undefined) {
        setCurrentDonatedAmount(donatedAmount);
      } else {
        console.log("Received undefined value for donated amount");
      }
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
        await connectToMetaMask(); // Connect to MetaMask if not already connected
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contractAddress = "0x1d306995e2707a22ff26e8dd4ecd8c43e2257221";
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const amountInEther = parseFloat(donationAmount);
      if (isNaN(amountInEther)) {
        throw new Error("Invalid donation amount");
      }

      // Convert the donation amount to BigNumber format
      const amountInWei = ethers.utils.parseUnits(
        amountInEther.toString(),
        "ether"
      );

      // Send donation along with calling donate function in the contract
      const overrides = {
        value: amountInWei, // Sending ether along with the transaction
      };

      // Make sure to include overrides parameter in the contract call
      const transaction = await contract.donate(amountInWei, overrides);

      console.log("Donation transaction:", transaction);
    } catch (error) {
      console.error("Error donating:", error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const progress =
    ((campaign.amountCollected + currentDonatedAmount) / campaign.target) * 100;

  function convertUnixTimestampToDate(unixTimestamp: number) {
    // Multiply by 1000 to convert from seconds to milliseconds
    const date = new Date(unixTimestamp * 1000);

    // Get year, month (0-indexed), day, hours, minutes, seconds, milliseconds
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero for single-digit months
    const day = String(date.getDate()).padStart(2, "0"); // Add leading zero for single-digit days
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Format the date in a common format (YYYY-MM-DD HH:MM:SS)
    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
  }

  return (
    <div>
      <h1>{campaign.title}</h1>
      <p>{campaign.description}</p>
      <p>Owner: {campaign.owner}</p>
      <p>Target: {campaign.target}</p>
      <p>Amount Collected: {campaign.amountCollected.toString()}</p>
      <p>Current Donated Amount: {currentDonatedAmount.toString()}</p>
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
