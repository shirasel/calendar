"use strict";

const { HOLIDAY_UPDATE_CONFIG } = require("../config/holidayUpdateConfig");
const { HolidayCsvUpdater } = require("../services/HolidayCsvUpdater");
const { MonthlyScheduler } = require("../schedulers/MonthlyScheduler");

class HolidayUpdateApplication {
  constructor(argv, config = HOLIDAY_UPDATE_CONFIG) {
    this.argv = argv;
    this.config = config;
    this.updater = new HolidayCsvUpdater(
      config.csvUrl,
      config.outputPath,
      config.dataScriptPath,
      config.dataGlobalName,
      config.timeZone
    );
    this.scheduler = new MonthlyScheduler(() => this.updater.update(), config.timeZone);
  }

  async run() {
    await this.updater.update();

    if (this.shouldWatch()) {
      this.scheduler.start();
    }
  }

  shouldWatch() {
    return this.argv.includes("--watch");
  }
}

module.exports = { HolidayUpdateApplication };
