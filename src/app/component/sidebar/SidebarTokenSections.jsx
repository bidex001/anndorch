import Image from "next/image";
import { IoIosArrowDown } from "react-icons/io";
import { BsBoxArrowUpRight } from "react-icons/bs";

const SidebarTokenSections = ({ sections, open, toggle, arrowClass, dropdownClass, sectionClass }) => {
  return (
    <div className="flex py-3 px-5 flex-col gap-5 w-full">
      {sections.map((section) => {
        const isDropdown = Array.isArray(section.items) && section.items.length > 0;
        const isOpen = Boolean(open[section.key]);

        if (!isDropdown) {
          return (
            <div key={section.title} className="flex items-center justify-between w-full cursor-pointer">
              <div className="flex items-center gap-4">
                <Image src={section.icon} alt={section.title} width={20} height={20} />
                <p className="text-lg capitalize text-gray-600">{section.title}</p>
              </div>
              {section.external && <BsBoxArrowUpRight />}
            </div>
          );
        }

        return (
          <div key={section.key} className={sectionClass(isOpen)}>
            <div
              className="flex items-center justify-between w-full cursor-pointer"
              onClick={() => toggle(section.key)}
            >
              <div className="flex items-center gap-4">
                <Image src={section.icon} alt={section.title} width={20} height={20} />
                <p className="text-lg capitalize text-gray-600">{section.title}</p>
              </div>
              <IoIosArrowDown className={arrowClass(isOpen)} />
            </div>
            <div className={`${dropdownClass(isOpen)} gap-5 pl-12 *:text-[16px] *:capitalize`}>
              {section.items.map((item) => (
                <p key={item} className="text-gray-600">
                  {item}
                </p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SidebarTokenSections;
