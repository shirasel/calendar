import { MAX_YEAR, MIN_YEAR } from "../config/calendarConfig.js";
import { HolidayRepository } from "../repositories/HolidayRepository.js";
import { DateUtils } from "../utils/DateUtils.js";
import { CalendarRenderer } from "../views/CalendarRenderer.js";

export class CalendarController {
  constructor(elements) {
    this.elements = elements;
    this.today = new Date();
    this.currentYear = this.today.getFullYear();
    this.currentMonth = this.today.getMonth() + 1;
    this.holidayRepository = new HolidayRepository();
    this.renderer = new CalendarRenderer(elements, this.holidayRepository);
  }

  async initialize() {
    this.populateSelectors();
    this.bindEvents();
    await this.holidayRepository.load();
    this.updateDataSource();
    this.updateSelectors();
  }

  populateSelectors() {
    for (let year = MIN_YEAR; year <= MAX_YEAR; year += 1) {
      const option = document.createElement("option");
      option.value = String(year);
      option.textContent = `${year}年`;
      this.elements.yearSelect.appendChild(option);
    }

    for (let month = 1; month <= 12; month += 1) {
      const option = document.createElement("option");
      option.value = String(month);
      option.textContent = `${month}月`;
      this.elements.monthSelect.appendChild(option);
    }
  }

  bindEvents() {
    this.elements.yearSelect.addEventListener("change", () => {
      this.currentYear = Number(this.elements.yearSelect.value);
      this.render();
    });

    this.elements.monthSelect.addEventListener("change", () => {
      this.currentMonth = Number(this.elements.monthSelect.value);
      this.render();
    });

    this.elements.prevYearButton.addEventListener("click", () => this.moveMonth(-12));
    this.elements.prevMonthButton.addEventListener("click", () => this.moveMonth(-1));
    this.elements.nextMonthButton.addEventListener("click", () => this.moveMonth(1));
    this.elements.nextYearButton.addEventListener("click", () => this.moveMonth(12));
    this.elements.todayButton.addEventListener("click", () => this.moveToday());
  }

  moveMonth(diff) {
    const next = new Date(this.currentYear, this.currentMonth - 1 + diff, 1);
    this.currentYear = DateUtils.clampYear(next.getFullYear());
    this.currentMonth = next.getMonth() + 1;

    if (next.getFullYear() < MIN_YEAR) this.currentMonth = 1;
    if (next.getFullYear() > MAX_YEAR) this.currentMonth = 12;

    this.updateSelectors();
  }

  moveToday() {
    this.currentYear = this.today.getFullYear();
    this.currentMonth = this.today.getMonth() + 1;
    this.updateSelectors();
  }

  updateSelectors() {
    this.currentYear = DateUtils.clampYear(this.currentYear);
    this.elements.yearSelect.value = String(this.currentYear);
    this.elements.monthSelect.value = String(this.currentMonth);
    this.render();
  }

  updateDataSource() {
    this.elements.dataSource.textContent = this.holidayRepository.size > 0
      ? `内閣府CSV ${this.holidayRepository.size}件`
      : "CSV未読み込み";
  }

  render() {
    this.renderer.render(this.currentYear, this.currentMonth);
  }
}
