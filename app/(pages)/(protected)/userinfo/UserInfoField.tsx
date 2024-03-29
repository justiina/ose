import React from "react";

type InputFieldType = {
  title: string;
  content: string | string[] | undefined;
};

const UserInfoField: React.FC<InputFieldType> = ({ title, content }) => {
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
    <div className="py-2">
      <p className="font-bold text-grey">{title}</p>
      {renderContent(content)}
    </div>
  );
};

export default UserInfoField;
