import { RESERVATION_BUFFER_MINUTES } from "./tableConfig.js";

export function timeToMinutes(value) {
  const [hours, minutes] = String(value || "").split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return hours * 60 + minutes;
}

export function getTodayInputValue(now = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isPastTimeForDate(dateValue, timeValue, now = new Date()) {
  if (!dateValue || !timeValue) return false;

  const today = getTodayInputValue(now);
  if (dateValue !== today) return false;

  const [hours, minutes] = timeValue.split(":").map(Number);
  const selected = new Date(now);
  selected.setHours(hours, minutes, 0, 0);

  return selected <= now;
}

export function isWithinReservationBuffer(
  firstTime,
  secondTime,
  bufferMinutes = RESERVATION_BUFFER_MINUTES
) {
  const first = timeToMinutes(firstTime);
  const second = timeToMinutes(secondTime);

  if (first === null || second === null) return firstTime === secondTime;

  const distance = Math.abs(first - second);
  const dayAwareDistance = Math.min(distance, 24 * 60 - distance);

  return dayAwareDistance < bufferMinutes;
}
