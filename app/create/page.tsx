// Import necessary modules and components
"use client";
// Import necessary modules and components
import React, { useState } from "react";
import Sidemenu from "@/components/sidemenu";
import { ethers } from "ethers";
import CampaignContract from "@/contracts/CampaignContract.json";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBkmlxE9CAnIyM4sV1g1MRhnYWylwxKjdU",
  authDomain: "web3-c0dda.firebaseapp.com",
  projectId: "web3-c0dda",
  storageBucket: "web3-c0dda.appspot.com",
  messagingSenderId: "1063778621567",
  appId: "1:1063778621567:web:e5c970491d8ef662b9474a",
  measurementId: "G-C5H78S23QV"
};

// Initialize Firebase
import "firebase/storage"; // Import Firebase storage module

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Firebase storage instance
const storage = firebase.storage();

// Define ABI from CampaignContract.json
const abi = CampaignContract;

// Declare global interface for window.ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}

// Define Create component
const Create = () => {
  // State variables
  const [successfulSubmit, setSuccessfulSubmit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    goalAmount: "",
    deadline: "",
    image: null, // Change to null for Firebase
  });

  // Function to handle form input changes
  const handleChange = (event: {
    target: { files?: any; name?: any; value?: any; type?: any };
  }) => {
    const { name, value, type } = event.target;
    const val = type === "file" ? event.target.files[0] : value; // Handle file input
    setFormData({ ...formData, [name]: val });
  };

  // Function to handle form submission
  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    try {
      // Connect to Ethereum network
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      // Initialize campaign contract instance
      const campaignContract = new ethers.Contract(
        "0x94cdb95d1c37b4165a54cdd828c091b1177bb815",
        abi,
        signer
      );

      // Convert deadline to timestamp
      const deadline = new Date(formData.deadline);
      const year = deadline.getFullYear();
      const month = deadline.getMonth() ;
      const day = deadline.getDate();

      // Upload image to Firebase Storage
      const imageRef = storage.ref().child(formData.image?.name); // Add null check before accessing name property
      await imageRef.put(formData.image); // Upload image file

      // Get download URL of the uploaded image
      const imageUrl = await imageRef.getDownloadURL();

      // Get signer's address
      const address = await signer.getAddress();

      console.log("Contract instance:", campaignContract);

      // Create campaign with Firebase image URL
      const receipt = await campaignContract.createCampaign(
        address,
        formData.title,
        formData.description,
        parseInt(formData.goalAmount),
        year,
        month,
        day,
        imageUrl // Provide the Firebase image URL
      );

      // Log success and reset form data
      console.log("Campaign created successfully:", receipt);
      console.log(deadline);
      setSuccessfulSubmit(true);

      setFormData({
        name: "",
        title: "",
        description: "",
        goalAmount: "",
        deadline: "",
        image: null, // Reset image state
      });
    } catch (error) {
      console.error("Failed to create campaign:", error);
    }
  };

  // Render component
  return (
    <div>
      <Sidemenu />
      <div className="bg-black min-h-screen px-4 sm:px-6 lg:px-8 flex justify-center items-center pb-2 pt-10">
        <div className="max-w-3xl w-full bg-[#1c1c24] px-4 py-8 sm:px-6 lg:px-8 rounded-xl">
          <div className="bg-[#3a3a43] rounded-xl p-4">
            <h1 className="text-white text-2xl font-semibold text-center">
              Start a Campaign
            </h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <h3 className="text-[#808191]">Image*</h3>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="input-field bg-transparent placeholder:text-[#808191] border-[#808191] border-2 rounded-xl p-2 w-full focus:outline-none focus:border-emerald-500 text-white"
              />
            </div>
            {/* Other form fields */}
            <div className="md:flex justify-between">
              <div className="mt-4">
                <h3 className="text-[#808191] font-epilogue">Name*</h3>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="input-field bg-transparent placeholder:text-[#808191] border-[#808191] border-2 rounded-xl p-2 w-full md:w-72 focus:outline-none focus:border-emerald-500 text-white"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-[#808191]">Title*</h3>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Campaign Title"
                  className="input-field bg-transparent placeholder:text-[#808191] border-[#808191] border-2 rounded-xl p-2 w-full md:w-72 focus:outline-none focus:border-emerald-500 text-white"
                />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-[#808191]">Description*</h3>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Campaign Description"
                rows="4"
                className="input-field bg-transparent placeholder:text-[#808191] border-[#808191] border-2 rounded-xl p-2 w-full focus:outline-none focus:border-emerald-500 text-white"
              ></textarea>
            </div>
            <div className="bg-purple-600 h-[70px] text-center rounded-xl mt-4 w-full">
              <h1 className=" font-epilogue text-2xl pt-4">
                You'll get 100% of the amount collected
              </h1>
            </div>
            <div className="mt-4">
              <h3 className="text-[#808191]">Goal Amount*</h3>
              <input
                type="number"
                name="goalAmount"
                value={formData.goalAmount}
                onChange={handleChange}
                placeholder="Goal Amount"
                className="input-field bg-transparent placeholder:text-[#808191] border-[#808191] border-2 rounded-xl p-2 w
                -full focus:outline-none focus:border-emerald-500 text-white"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-[#808191]">Deadline*</h3>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                placeholder="Deadline"
                className="input-field bg-transparent placeholder:text-[#808191] border-[#808191] border-2 rounded-xl p-2 w-full focus:outline-none focus:border-emerald-500 text-white"
              />
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="bg-emerald-500 text-white py-2 px-4 rounded-xl"
              >
                Submit Campaign
              </button>
            </div>
            <div>
              {successfulSubmit && (
                <div className=" w-[300px] rounded-xl text-center">
                  <p className="text-emerald-500 rounded-lg mt-4 border-2 font-epilogue">
                    Campaign created successfully!
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Export Create component
export default Create;
