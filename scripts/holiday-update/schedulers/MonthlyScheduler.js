"use strict";

class MonthlyScheduler {
  constructor(task, timeZone) {
    this.task = task;
    this.timeZone = timeZone;
  }

  start() {
    this.scheduleNextUpdate();
  }

  scheduleNextUpdate() {
    const nextDate = this.nextMonthlyFetchDate();
    const delayMs = Math.max(nextDate.getTime() - Date.now(), 1000);
    const nextDateText = nextDate.toLocaleString("ja-JP", { timeZone: this.timeZone });

    console.log(`next update: ${nextDateText}`);

    setTimeout(() => {
      this.task().catch((error) => {
        console.error(error);
      }).finally(() => {
        this.scheduleNextUpdate();
      });
    }, delayMs);
  }

  nextMonthlyFetchDate(from = new Date()) {
    const year = from.getFullYear();
    const month = from.getMonth();
    const day = from.getDate();
    const lastDayOfNextMonth = new Date(year, month + 2, 0).getDate();

    return new Date(
      year,
      month + 1,
      Math.min(day, lastDayOfNextMonth),
      from.getHours(),
      from.getMinutes(),
      from.getSeconds(),
      from.getMilliseconds()
    );
  }
}

module.exports = { MonthlyScheduler };
