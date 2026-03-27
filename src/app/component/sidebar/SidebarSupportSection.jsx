import Image from "next/image";
import { IoIosArrowDown } from "react-icons/io";
import { BsBoxArrowUpRight } from "react-icons/bs";

const SidebarSupportSection = ({
  open,
  toggle,
  blockchainsRef,
  arrowClass,
  dropdownClass,
  sectionClass,
  blockchainOptions,
  blockchainItemClass,
  blockchain,
  setBlockchain,
}) => {
  return (
    <div className="flex flex-col w-full gap-5 border-t py-3 px-5 border-[#87CEEB]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image src="/support.webp" alt="support" width={20} height={20} />
          <p className="text-lg capitalize text-gray-600">support</p>
        </div>
        <BsBoxArrowUpRight />
      </div>

      <div className={sectionClass(Boolean(open.blockchains))} ref={blockchainsRef}>
        <div
          className="flex items-center justify-between w-full cursor-pointer"
          onClick={() => toggle("blockchains")}
        >
          <div className="flex items-center gap-4">
            <Image src="/blockchain.webp" alt="blockchains" width={20} height={20} />
            <p className="text-lg capitalize text-gray-600">blockchains</p>
          </div>
          <IoIosArrowDown className={arrowClass(Boolean(open.blockchains))} />
        </div>

        <div
          className={`${dropdownClass(
            Boolean(open.blockchains)
          )} relative md:absolute md:left-[calc(100%+12px)] md:top-0 z-[1000] *:cursor-pointer !w-full md:!w-[220px] flex flex-col items-start gap-5 rounded-lg px-5 py-3 !bg-[snow] !min-h-[16px] border border-[#D6F0FA]`}
        >
          {blockchainOptions.map(([value, icon, label]) => (
            <div
              key={value}
              className={blockchainItemClass(blockchain === value)}
              onClick={() => setBlockchain(value)}
            >
              <Image src={icon} alt={label} width={15} height={20} />
              <p className="text-gray-700 font-bold text-[16px] capitalize">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 w-full">
        <Image src="/docs.webp" alt="docs" width={20} height={20} />
        <p className="text-lg capitalize text-gray-600">docs</p>
      </div>
    </div>
  );
};

export default SidebarSupportSection;
