"use client";
import React, { useState } from "react";
import Sidemenu from "@/components/sidemenu";
import { ethers } from "ethers";
import CampaignContract from "@/contracts/CampaignContract.json";

const abi = CampaignContract;

declare global {
  interface Window {
    ethereum: any;
  }
}

const Create = () => {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    goalAmount: "",
    deadline: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const campaignContract = new ethers.Contract(
        "0x53496afb9301d6e619d13a35798b5a32e4877a64",
        abi,
        signer
      );

      const deadline = new Date(formData.deadline);
      const year = deadline.getFullYear();
      const month = deadline.getMonth() + 1; // Month index starts from 0
      const day = deadline.getDate();

      const deadlineTimestamp = Math.floor(deadline.getTime() / 1000);

      const address = await signer.getAddress();

      const receipt = await campaignContract.createCampaign(
        address,
        formData.title,
        formData.description,
        parseInt(formData.goalAmount),
        year,
        month,
        day,
        "" // No image provided in this form
      );

      console.log("Campaign created successfully:", receipt);

      setFormData({
        name: "",
        title: "",
        description: "",
        goalAmount: "",
        deadline: "",
      });
    } catch (error) {
      console.error("Failed to create campaign:", error);
    }
  };

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
            <div className="mt-4">
              <button
                type="submit"
                className="bg-emerald-500 text-white py-2 px-4 rounded-xl"
              >
                Submit Campaign
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Create;
