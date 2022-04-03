class Expense {
  constructor(day, month, year, type, description, amount) {
    this.day = day;
    this.month = month;
    this.year = year;
    this.type = type;
    this.description = description;
    this.amount = amount;
  }
}

class Database {

  constructor() {
    let id = localStorage.getItem('id');
    if(id === null) {
      localStorage.setItem('id', 0);
    }
  }

  getNextId() {
    let nextId = localStorage.getItem('id');
    return parseInt(nextId)+1;
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

  db.store(expense);
}