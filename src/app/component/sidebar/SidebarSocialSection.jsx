import { FaDiscord, FaTelegram, FaTwitter, FaYoutube } from "react-icons/fa";

const SidebarSocialSection = ({ hover, setHover, hoverPositionClass }) => {
  return (
    <div className="w-full flex flex-col items-center relative">
      <div className="flex w-full items-center pb-10 justify-center gap-7 *:text-3xl *:cursor-pointer *:text-[#1B4C63]">
        <button
          className="hover:text-[#007BFF]"
          onMouseEnter={() => setHover("follow us on Discord")}
          onMouseLeave={() => setHover("")}
        >
          <FaDiscord />
        </button>
        <button
          className="hover:text-[#007BFF]"
          onMouseEnter={() => setHover("follow us on Telegram")}
          onMouseLeave={() => setHover("")}
        >
          <FaTelegram />
        </button>
        <button
          className="hover:text-[#007BFF]"
          onMouseEnter={() => setHover("follow us on Twitter")}
          onMouseLeave={() => setHover("")}
        >
          <FaTwitter />
        </button>
        <button
          className="hover:text-[#007BFF]"
          onMouseEnter={() => setHover("follow us on Youtube")}
          onMouseLeave={() => setHover("")}
        >
          <FaYoutube />
        </button>
      </div>

      {hover && (
        <p
          className={`absolute bottom-10 ${hoverPositionClass} bg-[#1B4C63] text-white px-2 py-1 rounded-md text-xs`}
        >
          {hover}
        </p>
      )}
    </div>
  );
};

export default SidebarSocialSection;
