import { MAX_YEAR, MIN_YEAR } from "../config/calendarConfig.js";

export class DateUtils {
  static pad(number) {
    return String(number).padStart(2, "0");
  }

  static dateKey(year, month, day) {
    return `${year}-${DateUtils.pad(month)}-${DateUtils.pad(day)}`;
  }

  static addDays(date, days) {
    const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    next.setDate(next.getDate() + days);
    return next;
  }

  static clampYear(year) {
    return Math.min(Math.max(year, MIN_YEAR), MAX_YEAR);
  }
}
