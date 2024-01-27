interface Props {
  text: string;
  onClick: () => void;
}

const Button: React.FC<Props> = ({ text, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-orange hover:bg-blue text-white px-5 py-2 rounded-full text-xs"
    >
      {text}
    </button>
  );
};

export default Button;
