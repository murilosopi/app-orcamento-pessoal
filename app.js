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

  getAllRegisters() {
    let expenses = [];
    let id = localStorage.getItem('id');
    for(let i = 1; i <= id; i++) {
      const expense = JSON.parse(localStorage.getItem(i));
      if(expense === null) {
        continue;
      }
      expenses.push(expense);
    }
    return expenses;
  }

  search(expense) {
    let filtredExpenses = this.getAllRegisters();
    // ano
    if(expense.year != '') {
      filtredExpenses = filtredExpenses.filter(e => e.year == expense.year);
    }
    if(expense.month != '') {
      filtredExpenses = filtredExpenses.filter(e => e.month == expense.month);
    }
    if(expense.day != '') {
      filtredExpenses = filtredExpenses.filter(e => e.day == expense.day);
    }
    if(expense.type != '') {
      filtredExpenses = filtredExpenses.filter(e => e.type == expense.type);
    }
    if(expense.description != '') {
      filtredExpenses = filtredExpenses.filter(e => e.description == expense.description);
    }

    return filtredExpenses;
  }
}
let db = new Database();

try {
  const formRegister = document.getElementById('register');
  formRegister.addEventListener('submit', e => {
    e.preventDefault();
    const expense = createExpense();
    registerExpense(expense);
    formRegister.reset();
  });
} catch {
  const formSearch = document.getElementById('search');
  formSearch.addEventListener('submit', e => {
    e.preventDefault();
    searchExpense();
    formSearch.reset();
  });
}


function createExpense() {
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

  return expense;
}

function registerExpense(expense) {
  if (expense.validateData()) {
    db.store(expense);
    $('#modal-feedback').modal('show');
    showSuccessModal()
  } else {
    showErrorModal();
    $('#modal-feedback').modal('show');
  }
}

function showSuccessModal() {
  const modal = document.querySelector('#modal-feedback');
  const message = modal.querySelector('#modal-msg');
  message.textContent = " A despesa foi registrada no sistema com sucesso.";

  const title = modal.querySelector('.modal-title');
  title.textContent = "Registro feito";
  title.className = 'modal-title text-success';

  const btn = modal.querySelector('.btn');
  btn.className = 'btn btn-outline-success';
  btn.textContent = 'Fechar';
}

function showErrorModal() {
  const modal = document.querySelector('#modal-feedback');
  const message = modal.querySelector('#modal-msg');
  message.textContent = "Existem campos obrigatórios que não foram preenchidos com dados válidos. Por favor, preencha novamente.";

  const title = modal.querySelector('.modal-title');
  title.textContent = "Erro na gravação";
  title.className = 'modal-title text-danger';

  const btn = modal.querySelector('.btn');
  btn.className = 'btn btn-danger';
  btn.textContent = 'Fechar';
}

function getType(t) {
  switch(t) {
    case 1: return 'Alimentação';
    case 2: return 'Educação';
    case 3: return 'Lazer';
    case 4: return 'Saúde';
    case 5: return 'Transporte';
    case 6: return 'Comunicação';
    case 7: return 'Beleza';
    case 8: return 'Vestuário';
    case 9: return 'Consumo';
  }
}

function loadExpensesList(expenses) {
  const bodyTable = document.querySelector('table.table > tbody');
  bodyTable.textContent = null;

  expenses.forEach(expense => {
    const tr = bodyTable.insertRow();

    const dateCell = tr.insertCell(0);
    dateCell.textContent = new Date(
      expense.year,
      (expense.month - 1),
      expense.day
    ).toLocaleDateString();

    const typeCell = tr.insertCell(1);
    typeCell.textContent = getType(parseInt(expense.type));

    const descriptionCell = tr.insertCell(2);
    descriptionCell.textContent = expense.description;

    const amountCell = tr.insertCell(3);
    amountCell.textContent = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense.amount);

    tr.append(dateCell, typeCell, descriptionCell, amountCell);
    bodyTable.appendChild(tr);
  })
}

function searchExpense() {
  const expense = createExpense();
  const soughtExpenses = db.search(expense);
  loadExpensesList(soughtExpenses);
}