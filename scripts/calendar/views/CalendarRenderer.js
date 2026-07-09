class CalendarRenderer {
  constructor(elements, holidayRepository) {
    this.elements = elements;
    this.holidayRepository = holidayRepository;
    this.today = new Date();
  }

  render(year, month) {
    const holidays = this.createVisibleHolidays(year);

    this.elements.monthTitle.textContent = `${year}年 ${month}月`;
    this.elements.calendarGrid.replaceChildren();
    this.elements.calendarGrid.setAttribute("role", "grid");

    const firstDay = new Date(year, month - 1, 1);
    const startDate = window.DateUtils.addDays(firstDay, -firstDay.getDay());

    for (let index = 0; index < 42; index += 1) {
      const displayDate = window.DateUtils.addDays(startDate, index);
      this.elements.calendarGrid.appendChild(this.createDayCell(displayDate, month, holidays));
    }

    this.renderHolidayList(year, month, holidays);
  }

  createVisibleHolidays(year) {
    const holidays = this.holidayRepository.findByYear(year);

    for (const [key, name] of this.holidayRepository.findByYear(year - 1)) {
      holidays.set(key, name);
    }

    for (const [key, name] of this.holidayRepository.findByYear(year + 1)) {
      holidays.set(key, name);
    }

    return holidays;
  }

  createDayCell(displayDate, targetMonth, holidays) {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth() + 1;
    const day = displayDate.getDate();
    const key = window.DateUtils.dateKey(year, month, day);
    const holidayName = holidays.get(key);
    const dayOfWeek = displayDate.getDay();
    const cell = document.createElement("div");
    const classes = ["day-cell"];

    if (month !== targetMonth) classes.push("outside");
    if (dayOfWeek === 0) classes.push("sunday");
    if (dayOfWeek === 6) classes.push("saturday");
    if (holidayName) classes.push("holiday");
    if (this.isToday(year, month, day)) classes.push("today");

    cell.className = classes.join(" ");
    cell.setAttribute("role", "gridcell");
    cell.setAttribute(
      "aria-label",
      `${year}年${month}月${day}日 ${window.CalendarConfig.weekdays[dayOfWeek]}曜日${holidayName ? ` ${holidayName}` : ""}`
    );

    const number = document.createElement("span");
    number.className = "day-number";
    number.textContent = day;
    cell.appendChild(number);

    if (holidayName) {
      const label = document.createElement("span");
      label.className = "holiday-name";
      label.textContent = holidayName;
      cell.appendChild(label);
    }

    return cell;
  }

  isToday(year, month, day) {
    return year === this.today.getFullYear()
      && month === this.today.getMonth() + 1
      && day === this.today.getDate();
  }

  renderHolidayList(year, month, holidays) {
    this.elements.holidayList.replaceChildren();

    const monthlyHolidays = [...holidays.entries()]
      .map(([key, name]) => {
        const [holidayYear, holidayMonth, holidayDay] = key.split("-").map(Number);
        return { year: holidayYear, month: holidayMonth, day: holidayDay, name };
      })
      .filter((holiday) => holiday.year === year && holiday.month === month)
      .sort((a, b) => a.day - b.day);

    if (monthlyHolidays.length === 0) {
      const item = document.createElement("li");
      item.className = "empty-message";
      item.textContent = "この月の祝日・休日はありません。";
      this.elements.holidayList.appendChild(item);
      return;
    }

    for (const holiday of monthlyHolidays) {
      this.elements.holidayList.appendChild(this.createHolidayListItem(holiday));
    }
  }

  createHolidayListItem(holiday) {
    const item = document.createElement("li");
    const date = document.createElement("span");
    const name = document.createElement("span");
    const dayOfWeek = new Date(holiday.year, holiday.month - 1, holiday.day).getDay();

    date.className = "holiday-date";
    date.textContent = `${holiday.month}/${holiday.day}(${window.CalendarConfig.weekdays[dayOfWeek]})`;
    name.textContent = holiday.name;

    item.append(date, name);
    return item;
  }
}

window.CalendarRenderer = CalendarRenderer;
