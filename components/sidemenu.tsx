import React from "react";
import {
  AiOutlineHome,
  AiOutlineNotification,
  AiOutlineWallet,
  AiOutlineUser,
  AiOutlineLogout,
} from "react-icons/ai";

const Sidemenu = () => {
  return (
    <div className="hidden md:visible fixed h-screen w-16 md:flex flex-col ml-2 justify-between border-r border-[#3a3a43] rounded-2xl bg-[#1c1c24]">
      <div>
        <div className="border-t border-gray-800">
          <div className="px-2">
            <div className="py-4">
              <a
                href="/"
                className="group relative flex justify-center rounded   px-2 py-1.5 text-gray-400"
              >
                <AiOutlineHome className="size-5 opacity-75 text-gray-400" />

                <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                  Home
                </span>
              </a>
            </div>

            {/* Add other menu items */}
            <div className="py-4">
              <a
                href="/browse"
                className="group relative flex justify-center rounded  px-2 py-1.5 text-gray-400"
              >
                <AiOutlineNotification className="size-5 opacity-75 text-gray-400" />

                <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                  Announcements
                </span>
              </a>
            </div>

            {/* Wallet */}
            <div className="py-4">
              <a
                href="#"
                className="group relative flex justify-center rounded   px-2 py-1.5 text-gray-400"
              >
                <AiOutlineWallet className="size-5 opacity-75 text-gray-400" />

                <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                  Wallet
                </span>
              </a>
            </div>

            {/* Profile */}
            <div className="py-4">
              <a
                href="/Dashboard"
                className="group relative flex justify-center rounded   px-2 py-1.5 text-gray-400"
              >
                <AiOutlineUser className="size-5 opacity-75 text-gray-400" />

                <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                  Profile
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky inset-x-0 bottom-0  p-2">
        <form action="#">
          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-lg  text-sm text-gray-400   hover:text-gray-300"
          >
            <AiOutlineLogout className="size-5 opacity-75 text-gray-400" />

            <span className="invisible absolute start-full  ms-4 -translate-y-1/2 rounded text-xs font-medium text-white group-hover:visible">
              Logout
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sidemenu;
