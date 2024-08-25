import React from "react";
import Link from "next/link";
import { LinkProps } from "next/link";

type ButtonProps = {
  title: string;
  color: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
};

type OwnLinkProps = {
  title: string;
  color: string;
  href: LinkProps["href"];
  icon?: React.ReactNode;
};

// Define reusable classNames for each component that has same styling
const filledClassName = (color: string): string => {
  let textColor: string = "";
  if (color === "greylight") {
    textColor = "grey";
  } else {
    textColor = "white";
  }

  return `flex justify-center items-center gap-2 px-4 py-2 bg-${color} text-${textColor} rounded-lg hover:bg-${color}hover active:bg-${color}hover`;
};

const FilledButton: React.FC<ButtonProps> = ({
  title,
  color,
  onClick,
  icon,
  type = "submit",
}) => {
  return (
    <button type={type} onClick={onClick} className={filledClassName(color)}>
      {icon && <span>{icon}</span>}
      {title}
    </button>
  );
};

export const FilledLink: React.FC<OwnLinkProps> = ({
  title,
  color,
  href,
  icon,
}) => {
  return (
    <Link href={href} className={filledClassName(color)}>
      {icon && <span>{icon}</span>}
      {title}
    </Link>
  );
};

export default FilledButton;
