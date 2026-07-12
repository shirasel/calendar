const controller = new window.CalendarController({
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
  todayButton: document.getElementById("todayButton"),
  memoDialog: document.getElementById("memoDialog"),
  memoDialogTitle: document.getElementById("memoDialogTitle"),
  memoText: document.getElementById("memoText"),
  memoCancelButton: document.getElementById("memoCancelButton"),
  memoDeleteButton: document.getElementById("memoDeleteButton"),
  memoSaveButton: document.getElementById("memoSaveButton")
});

controller.initialize();
