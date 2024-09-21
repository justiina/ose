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
  openInNewTab?: boolean;
};

// Define reusable classNames for each component that has same styling
const filledClassName = (color: string): string => {
  let textColor: string = "";
  if (color === "greylight") {
    textColor = "text-grey";
  } else {
    textColor = "text-white";
  }

  const bgColor = `bg-${color}`;
  const hoverColor = `hover:bg-${color}hover`;
  const activeColor = `active:bg-${color}hover`;

  return `flex justify-center items-center gap-2 px-4 py-2 ${bgColor} ${textColor} rounded-lg ${hoverColor} ${activeColor}`;
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
  openInNewTab = false,
}) => {
  if (openInNewTab) {
    return (
      <Link
        href={href}
        className={filledClassName(color)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {icon && <span>{icon}</span>}
        {title}
      </Link>
    );
  } else {
    return (
      <Link href={href} className={filledClassName(color)}>
        {icon && <span>{icon}</span>}
        {title}
      </Link>
    );
  }
};

export default FilledButton;
