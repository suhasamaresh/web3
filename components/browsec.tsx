import Link from "next/link";
import React from "react";

const browsec = () => {
  return (
    <div className="bg-gradient-to-r  from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% px-24 pt-5 h-screen">
        <h1 className="text-2xl font-medium text-black font-poppins ">Featured Campaigns</h1>
      <div className="container h-[500px] rounded-xl border"></div>
      <div>
        <h1 >Create campaigns here! </h1>
        <Link href={"/create"}>Create campaigns</Link>
      </div>
    </div>
  );
};

export default browsec;
