import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

// Define props interface for the dropdown component
interface DropdownProps {
  options: string[];
  onSelect: (selectedOption: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="dropdown">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        {selectedOption || "Valitse listalta"}
      </button>
      {isOpen && (
        <ul className="dropdown-menu cursor-pointer">
          {options.map((option) => (
            <li key={option} onClick={() => handleOptionSelect(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
