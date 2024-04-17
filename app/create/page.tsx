// Import necessary modules and components
"use client";
import React, { useState } from "react";
import Sidemenu from "@/components/sidemenu";
import { ethers } from "ethers";
import CampaignContract from "@/contracts/CampaignContract.json";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";

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

const Create = () => {
  // State variables
  const [successfulSubmit, setSuccessfulSubmit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    goalAmount: "",
    deadline: "",
    image: null,
  });

  // Function to handle form input changes
  const handleChange = (event) => {
    const { name, value, type } = event.target;
    const val = type === "file" ? event.target.files[0] : value;
    setFormData({ ...formData, [name]: val });
  };

  // Function to handle form submission
  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Connect to Ethereum network
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      // Initialize campaign contract instance
      const abi = CampaignContract;
      const campaignContract = new ethers.Contract(
        "0x11fdb66b6b6ff3d573dc79cb4dc2634150037f73",
        abi,
        signer
      );

      // Get signer's address
      const address = await signer.getAddress();

      // Convert deadline to timestamp
      const deadlineTimestamp = Math.floor(
        new Date(formData.deadline).getTime() / 1000
      );

      // Upload image to Firebase Storage
      const storageRef = firebase.storage().ref();
      if (formData.image) {
        const file = formData.image;
        // Get the number of existing campaigns to determine the index of the new image
        const campaignsArray = await campaignContract.getCampaigns();
        const imageIndex = campaignsArray.length;
        const imageRef = storageRef.child(
          `image_${imageIndex}.${file.name.split(".").pop()}`
        );
        await imageRef.put(file);
        const imageUrl = await imageRef.getDownloadURL();
        console.log("Image uploaded successfully:", imageUrl);

        // Create the campaign with image URL
        const receipt = await campaignContract.createCampaign(
          address,
          formData.title,
          formData.description,
          parseInt(formData.goalAmount),
          deadlineTimestamp,
          imageUrl
        );


        // Log success and reset form data
        console.log("Campaign created successfully:", receipt);
        setSuccessfulSubmit(true);
        setFormData({
          name: "",
          title: "",
          description: "",
          goalAmount: "",
          deadline: "",
          image: null,
        });
      }
    } catch (error) {
      console.error("Failed to create campaign:", error);
    }
  };

  // Render component
  return (
    <div>
      <Sidemenu />
      <div className="bg-black mt-16 min-h-screen px-4 sm:px-6 lg:px-8 flex justify-center items-center pb-2 pt-10">
        <div className="max-w-3xl w-full bg-[#1c1c24] px-4 py-8 sm:px-6 lg:px-8 rounded-xl">
          <div className="bg-[#3a3a43] rounded-xl p-4">
            <h1 className="text-white text-2xl font-semibold text-center">
              Start a Campaign
            </h1>
          </div>
          <form onSubmit={handleSubmit}>
            {/* Form inputs */}
            <div className="mt-4">
              <h3 className="text-[#808191]">Image*</h3>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="input-field bg-transparent placeholder:text-[#808191] border-[#808191] border-2 rounded-xl p-2 w-full focus:outline-none focus:border-emerald-500 text-white"
              />
            </div>
            {/* Other form inputs */}
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
                className="input-field bg-transparent placeholder:text-[#808191] border-[#808191] border-2 rounded-xl p-2 w-full focus:outline-none focus:border-emerald-500 text-white"
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
            {/* Submit button */}
            <div className="mt-4">
              <button
                type="submit"
                className="bg-emerald-500 text-white py-2 px-4 rounded-xl"
              >
                Submit Campaign
              </button>
            </div>
            {/* Success message */}
            {successfulSubmit && (
              <div className="w-[300px] rounded-xl text-center">
                <p className="text-emerald-500 rounded-lg mt-4 border-2 font-epilogue">
                  Campaign created successfully!
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Create;
