class DayMemoDialog {
  constructor(elements, memoRepository, onSave) {
    this.elements = elements;
    this.memoRepository = memoRepository;
    this.onSave = onSave;
    this.currentDateKey = "";
    this.bindEvents();
  }

  bindEvents() {
    this.elements.cancelButton.addEventListener("click", () => this.close());
    this.elements.saveButton.addEventListener("click", () => this.save());
    this.elements.deleteButton.addEventListener("click", () => this.delete());
    this.elements.textarea.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        this.close();
      }
    });
  }

  open(dateInfo) {
    this.currentDateKey = dateInfo.key;
    this.elements.title.textContent = `${dateInfo.year}年${dateInfo.month}月${dateInfo.day}日のメモ`;
    this.elements.textarea.value = this.memoRepository.find(dateInfo.key);
    this.elements.deleteButton.disabled = !this.memoRepository.has(dateInfo.key);

    if (typeof this.elements.dialog.showModal === "function") {
      this.elements.dialog.showModal();
    } else {
      this.elements.dialog.setAttribute("open", "");
    }

    this.elements.textarea.focus();
  }

  save() {
    this.memoRepository.save(this.currentDateKey, this.elements.textarea.value);
    this.close();
    this.onSave();
  }

  delete() {
    this.memoRepository.delete(this.currentDateKey);
    this.elements.textarea.value = "";
    this.close();
    this.onSave();
  }

  close() {
    if (typeof this.elements.dialog.close === "function") {
      this.elements.dialog.close();
    } else {
      this.elements.dialog.removeAttribute("open");
    }
  }
}

window.DayMemoDialog = DayMemoDialog;
