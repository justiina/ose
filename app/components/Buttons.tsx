import React from "react";
import Link from "next/link";
import { LinkProps } from "next/link";

type ButtonProps = {
  title: string;
  color: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

type OwnLinkProps = {
  title: string;
  color: string;
  href: LinkProps["href"];
};

// Define reusable classNames for each component that has same styling
const filledClassName = (color: string): string => {
  let textColor: string = "";
  if (color === "greylight") {
    textColor = "grey";
  } else textColor = "white";
  return `px-4 py-2 bg-${color} text-${textColor} rounded-lg hover:bg-${color}hover active:bg-${color}hover`;
};

const FilledButton: React.FC<ButtonProps> = ({ title, color, onClick }) => {
  return (
    <button onClick={onClick} className={filledClassName(color)}>
      {title}
    </button>
  );
};

export const FilledLink: React.FC<OwnLinkProps> = ({ title, color, href }) => {
  return (
    <Link href={href} className={filledClassName(color)}>
      {title}
    </Link>
  );
};

export default FilledButton;
