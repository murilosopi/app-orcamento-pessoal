class Expense {
  constructor(day, month, year, type, description, amount) {
    this.day = day;
    this.month = month;
    this.year = year;
    this.type = type;
    this.description = description;
    this.amount = amount;
  }

  validateData() {
    for (let attr in this) {
      if (
        this[attr] == undefined ||
        this[attr] == '' ||
        this[attr] == null
      ) {
        return false;
      }
    }

    // validates if the day of february is valid
    if (
      this.month == 2 && this.day > 29 ||
      this.month == 2 && this.year % 4 != 0 && this.day == 29
    ) {
      return false;
    } else {
      // validates if the month has 31 days
      if (this.month % 2 == 1 && this.day > 30) {
        return false;
      }
      return true;
    }
  }
}

class Database {

  constructor() {
    let id = localStorage.getItem('id');
    if (id === null) {
      localStorage.setItem('id', 0);
    }
  }

  getNextId() {
    let nextId = localStorage.getItem('id');
    return parseInt(nextId) + 1;
  }

  store(e) {
    let id = this.getNextId();
    localStorage.setItem('id', id);
    localStorage.setItem(id, JSON.stringify(e));
  }
}
let db = new Database();

const formRegister = document.getElementById('register');
formRegister.addEventListener('submit', e => {
  e.preventDefault();
  registerExpense(day.value, month.value, year.value, type.value, description.value, amount.value);
  formRegister.reset();
});

function registerExpense() {
  const day = document.getElementById('day');
  const month = document.getElementById('month');
  const year = document.getElementById('year');
  const type = document.getElementById('type');
  const description = document.getElementById('description');
  const amount = document.getElementById('amount');

  let expense = new Expense(
    day.value,
    month.value,
    year.value,
    type.value,
    description.value,
    amount.value
  );

  if (expense.validateData()) {
    db.store(expense);
    $('#success').modal('show');
  } else {
    $('#error').modal('show');
  }
}