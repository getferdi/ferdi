/* eslint-disable import/prefer-default-export */

export function isInTimeframe(start: string, end: string) {
  const [
    startHourStr,
    startMinuteStr,
  ] = start.split(':');
  const startHour = parseInt(startHourStr, 10);
  const startMinute = parseInt(startMinuteStr, 10);

  const [
    endHourStr,
    endMinuteStr,
  ] = end.split(':');
  const endHour = parseInt(endHourStr, 10);
  const endMinute = parseInt(endMinuteStr, 10);

  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();

  // Check if the end time is before the start time (scheduled overnight)
  // as we need to change our checks based on this
  const endBeforeStart = (startHour > endHour || (startHour === endHour && startMinute > endMinute));

  if (
    // End is after start (e.g. 09:00-17:00)
    !endBeforeStart
    // Check if past start
    && ((currentHour > startHour
        || (
          currentHour === startHour
          && currentMinute >= startMinute
        )
    )
      // Check that not past end
      && (currentHour < endHour
        || (
          currentHour === endHour
          && currentMinute < endMinute
        )
      ))
  ) {
    // We are in scheduled timeframe
    return true;
  }
  if (
    // End is before start (e.g. 17:00-09:00)
    endBeforeStart
    // Check if past start
    && ((currentHour > startHour
        || (
          currentHour === startHour
          && currentMinute >= startMinute
        )
    )
      // Check that we are not past end
      || (currentHour < endHour
        || (
          currentHour === endHour
          && currentMinute < endMinute
        )
      ))
  ) {
    // We are also in scheduled timeframe
    return true;
  }

  // We are not in scheduled timeframe
  return false;
}
