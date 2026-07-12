class DayMemoRepository {
  constructor(storageKey = "holiday-calendar-day-memos") {
    this.storageKey = storageKey;
  }

  find(dateKey) {
    return this.loadAll()[dateKey] || "";
  }

  has(dateKey) {
    return this.find(dateKey).trim().length > 0;
  }

  save(dateKey, memo) {
    const memos = this.loadAll();
    const trimmedMemo = memo.trim();

    if (trimmedMemo) {
      memos[dateKey] = trimmedMemo;
    } else {
      delete memos[dateKey];
    }

    this.saveAll(memos);
  }

  delete(dateKey) {
    const memos = this.loadAll();
    delete memos[dateKey];
    this.saveAll(memos);
  }

  loadAll() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || {};
    } catch (error) {
      console.warn(error);
      return {};
    }
  }

  saveAll(memos) {
    localStorage.setItem(this.storageKey, JSON.stringify(memos));
  }
}

window.DayMemoRepository = DayMemoRepository;
