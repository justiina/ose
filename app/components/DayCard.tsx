type Props = {
  date: string | null;
};

const DayCard = ({ date }: Props) => {
  return (
    <div>
      {date}
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        odit nam ab numquam reiciendis magni! Qui, laboriosam praesentium
        possimus quia culpa aperiam animi incidunt suscipit eveniet cum rerum,
        voluptate dolor?
      </p>
    </div>
  );
};

export default DayCard;
