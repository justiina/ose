import React from "react";

type InputFieldType = {
  title: string;
  content: string | undefined;
};

const UserInfoField: React.FC<InputFieldType> = ({ title, content }) => {
  return (
    <div className="py-2 px-4">
      <p className="font-bold text-grey">{title}</p>
      <p className="text-xl">{content}</p>
    </div>
  );
};

export default UserInfoField;
