import React, { useState } from "react";

// Define props interface for the dropdown components
interface DropdownProps {
  options: string[];
  onSelect: (selectedOption: string) => void;
}

interface MultiDropdownProps {
  options: string[];
  onSelect: (selectedOptions: string[]) => void;
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
    <div className="dropdown cursor-pointer" onClick={toggleDropdown}>
      <button className="dropdown-toggle">
        {selectedOption || "Valitse listalta"}
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option) => (
            <li
              className="hover:bg-blue hover:text-white"
              key={option}
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const MultiDropdown: React.FC<MultiDropdownProps> = ({
  options,
  onSelect,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option: string) => {
    const updatedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((selectedOption) => selectedOption !== option)
      : [...selectedOptions, option];
    setSelectedOptions(updatedOptions);
    onSelect(updatedOptions);
    setIsOpen(false);
  };

  return (
    <div className="dropdown cursor-pointer" onClick={toggleDropdown}>
      <button className="dropdown-toggle">
        {selectedOptions.length > 0
          ? selectedOptions.join(", ")
          : "Valitse listalta"}
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option) => (
            <li
              className={`hover:bg-blue hover:text-white ${
                selectedOptions.includes(option) ? "bg-blue text-white" : ""
              }`}
              key={option}
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
