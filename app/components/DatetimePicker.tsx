import { useState } from "react";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

function DatetimePicker() {
  const [time, setTime] = useState<Value>(new Date());

  const getDateAndTime = () => {
    console.log("painettu");
  };

  return (
    <div>
      <input
        id="datetimeInput"
        aria-label="Date and time"
        type="datetime-local"
        onChange={getDateAndTime}
      />
    </div>
  );
}
export default DatetimePicker;
