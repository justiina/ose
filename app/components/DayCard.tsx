type Props = {
  date: string | null;
};

const DayCard = ({ date }: Props) => {

  return <div>{date}</div>;
};

export default DayCard;
