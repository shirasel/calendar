import { CalendarController } from "./scripts/calendar/controllers/CalendarController.js";

const controller = new CalendarController({
  yearSelect: document.getElementById("yearSelect"),
  monthSelect: document.getElementById("monthSelect"),
  monthTitle: document.getElementById("monthTitle"),
  calendarGrid: document.getElementById("calendarGrid"),
  holidayList: document.getElementById("holidayList"),
  dataSource: document.getElementById("dataSource"),
  prevYearButton: document.getElementById("prevYear"),
  prevMonthButton: document.getElementById("prevMonth"),
  nextMonthButton: document.getElementById("nextMonth"),
  nextYearButton: document.getElementById("nextYear"),
  todayButton: document.getElementById("todayButton")
});

controller.initialize();
