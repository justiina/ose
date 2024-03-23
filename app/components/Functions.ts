export const showDateAndTime = (time: string | null) => {
  // Convert JavaScript timestamp into a user-frienly view
  if (time !== null && time !== undefined) {
    // Separate date components
    const date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Add 1 because month is zero-based
    const day = date.getDate();

    // Format the date
    const formattedDate = day + "." + month + "." + year;

    // Separate time components
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Format hours and minutes with leading zeros
    const formattedHours = hours < 10 ? "0" + hours : hours;
    const formattedMins = minutes < 10 ? "0" + minutes : minutes;

    return formattedDate + " klo " + formattedHours + "." + formattedMins;
  }
};


