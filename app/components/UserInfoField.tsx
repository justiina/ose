import React from "react";
import { MdOutlineEdit } from "react-icons/md";

type InputFieldType = {
  title: string;
  content: string | string[] | undefined;
  onEdit?: () => void;
};

const UserInfoField: React.FC<InputFieldType> = ({
  title,
  content,
  onEdit,
}) => {
  const renderContent = (content: string | string[] | undefined) => {
    // Render content of strings
    if (typeof content === "string") {
      return <p className="text-xl">{content}</p>;

      // Map through array content
    } else if (Array.isArray(content)) {
      if (content.length === 0) {
        return <p>-</p>;
      }
      return (
        <ul>
          {content.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="py-2 flex justify-between items-center">
      <div>
        <p className="font-bold text-grey">{title}</p>
        {renderContent(content)}
      </div>
      {onEdit && (
        <MdOutlineEdit
          onClick={onEdit}
          className="text-2xl text-grey cursor-pointer hover:text-blue active:text-blue"
        />
      )}
    </div>
  );
};

export default UserInfoField;
