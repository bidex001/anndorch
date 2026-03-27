"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { appContext } from "@/context/appContext";
import SidebarTokenSections from "./sidebar/SidebarTokenSections";
import SidebarSupportSection from "./sidebar/SidebarSupportSection";
import SidebarSocialSection from "./sidebar/SidebarSocialSection";
import { blockchainOptions, tokenSections } from "./sidebar/sidebarData";

const SideBar = () => {
  const [hover, setHover] = useState("");
  const [open, setOpen] = useState({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const blockchainsRef = useRef(null);
  const { blockchain, setBlockchain } = useContext(appContext);

  const toggle = (key) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const arrowClass = (isOpen) =>
    `transition-transform duration-300 ease-in-out ${isOpen ? "rotate-180" : ""}`;

  const dropdownClass = (isOpen) =>
    `w-full min-h-2 h-fit flex flex-col justify-center items-start bg-[#D6F0FA] rounded-b-lg overflow-hidden transition-all duration-300 ease-in-out ${
      isOpen ? "max-h-[1000px] opacity-100 p-5" : "max-h-0 opacity-0 p-0"
    }`;

  const sectionClass = (isOpen) => `flex flex-col w-full items-center ${isOpen ? "gap-2" : "gap-0"}`;

  const blockchainItemClass = (isActive) =>
    `relative z-0 py-2 w-full flex gap-2 items-center font-bold text-[16px] capitalize before:content-[''] before:absolute before:inset-y-0 before:-inset-x-5 first:before:-top-5 last:before:-bottom-5 before:bg-[#BCE7F5] before:rounded-md before:-z-10 before:transition-opacity before:duration-150 ${
      isActive ? "before:opacity-100" : "before:opacity-0 hover:before:opacity-100"
    }`;

  const hoverPositionClass =
    hover === "follow us on Youtube"
      ? "right-0"
      : hover === "follow us on Twitter"
      ? "right-10"
      : hover === "follow us on Telegram"
      ? "right-20"
      : hover === "follow us on Discord"
      ? "right-28"
      : "right-0";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!open.blockchains) return;
      if (!blockchainsRef.current) return;
      if (blockchainsRef.current.contains(event.target)) return;
      setOpen((prev) => ({ ...prev, blockchains: false }));
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open.blockchains]);

  return (
    <>
      <div className="md:hidden flex items-center justify-between w-full px-4 py-3 border-b border-[#D6F0FA] bg-white z-50">
        <p className="text-lg font-semibold text-gray-800">Menu</p>
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="px-3 py-2 bg-[#5BB6D6] text-white rounded-lg"
        >
          {mobileOpen ? "Close" : "Open"}
        </button>
      </div>

      {mobileOpen && (
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          aria-label="Close menu overlay"
        />
      )}

      <div
        className={`${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:static top-0 left-0 z-40 md:z-auto h-screen md:h-full w-[78%] sm:w-[60%] md:w-[25%] bg-white md:bg-transparent border-r border-[#D6F0FA] overflow-y-auto`}
      >
        <div className="flex flex-col gap-8 p-5 items-start min-h-full">
          <div className="flex gap-3 items-center">
            <Image src="/menu.webp" alt="menu" width={25} height={25} />
            <p className="text-lg capitalize text-gray-600">home</p>
          </div>

          <div className="flex flex-col h-full w-full items-center gap-5">
            <p className="text-gray-600 capitalize text-lg text-left w-full">token</p>

            <SidebarTokenSections
              sections={tokenSections}
              open={open}
              toggle={toggle}
              arrowClass={arrowClass}
              dropdownClass={dropdownClass}
              sectionClass={sectionClass}
            />

            <SidebarSupportSection
              open={open}
              toggle={toggle}
              blockchainsRef={blockchainsRef}
              arrowClass={arrowClass}
              dropdownClass={dropdownClass}
              sectionClass={sectionClass}
              blockchainOptions={blockchainOptions}
              blockchainItemClass={blockchainItemClass}
              blockchain={blockchain}
              setBlockchain={setBlockchain}
            />

            <SidebarSocialSection
              hover={hover}
              setHover={setHover}
              hoverPositionClass={hoverPositionClass}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
