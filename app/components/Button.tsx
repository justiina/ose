"use client";

type Props = {
  which: string;
};

const Button: React.FC<Props> = ({ which = "SignIn" }) => {
  const handleClick = () => {
    if (which === "SignIn") {
      console.log("button clicked");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="bg-orange hover:bg-blue active:bg-grey text-white px-5 py-2 rounded-full text-xs"
    >
      {which === "SignIn" && "Kirjaudu"}
    </button>
  );
};

export default Button;
