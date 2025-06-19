import { toZonedTime, format } from "date-fns-tz";

export function convertUtcToTashkentTimestamp(date: number | string): number {
  const utcDate = new Date(date);
  const tashkentDate = toZonedTime(utcDate, "Asia/Tashkent");

  return tashkentDate.getTime();
}
