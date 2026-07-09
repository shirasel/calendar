import { HOLIDAY_CSV_PATH } from "../config/calendarConfig.js";
import { HolidayCsvParser } from "../parsers/HolidayCsvParser.js";

export class HolidayRepository {
  constructor(csvPath = HOLIDAY_CSV_PATH, parser = new HolidayCsvParser()) {
    this.csvPath = csvPath;
    this.parser = parser;
    this.holidays = new Map();
  }

  get size() {
    return this.holidays.size;
  }

  async load() {
    try {
      const response = await fetch(`${this.csvPath}?v=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`CSV load failed: ${response.status}`);

      const bytes = await response.arrayBuffer();
      const decoder = new TextDecoder("shift_jis");
      this.holidays = this.parser.parse(decoder.decode(bytes));
    } catch (error) {
      console.warn(error);
      this.holidays = new Map();
    }
  }

  findByYear(year) {
    return new Map(
      [...this.holidays].filter(([key]) => Number(key.slice(0, 4)) === year)
    );
  }
}
