class HolidayRepository {
  constructor(
    csvPath = window.CalendarConfig.holidayCsvPath,
    parser = new window.HolidayCsvParser()
  ) {
    this.csvPath = csvPath;
    this.parser = parser;
    this.holidays = new Map();
    this.source = "none";
  }

  get size() {
    return this.holidays.size;
  }

  async load() {
    if (this.loadFromScriptData()) {
      return;
    }

    try {
      const response = await fetch(`${this.csvPath}?v=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`CSV load failed: ${response.status}`);

      const bytes = await response.arrayBuffer();
      const decoder = new TextDecoder("shift_jis");
      this.holidays = this.parser.parse(decoder.decode(bytes));
      this.source = "csv";
    } catch (error) {
      console.warn(error);
      this.holidays = new Map();
      this.source = "none";
    }
  }

  loadFromScriptData() {
    const data = window[window.CalendarConfig.holidayDataName];
    if (!Array.isArray(data) || data.length === 0) {
      return false;
    }

    this.holidays = new Map(data);
    this.source = "script";
    return true;
  }

  findByYear(year) {
    return new Map(
      [...this.holidays].filter(([key]) => Number(key.slice(0, 4)) === year)
    );
  }
}

window.HolidayRepository = HolidayRepository;
