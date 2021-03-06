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
    const id = localStorage.getItem('id');
    if (id === null) {
      localStorage.setItem('id', 0);
    }
  }

  getNextId() {
    const nextId = parseInt(localStorage.getItem('id')) + 1;
    return nextId;
  }

  store(expense) {
    const id = this.getNextId();
    localStorage.setItem('id', id);
    localStorage.setItem(id, JSON.stringify(expense));
  }

  getAllRegisters() {
    const expenses = [];
    const id = localStorage.getItem('id');
    for(let i = 1; i <= id; i++) {
      const expense = JSON.parse(localStorage.getItem(i));
      if(expense === null) {
        continue;
      }
      expense.id = i;
      expenses.push(expense);
    }
    return expenses;
  }

  search(expense) {
    let filtredExpenses = this.getAllRegisters();
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

  remove(id) {
      localStorage.removeItem(id);
  }
}
const db = new Database();

try {
  const formRegister = document.getElementById('register');
  formRegister.addEventListener('submit', e => {
    e.preventDefault();
    const expense = createExpense();
    if(registerExpense(expense)){
      formRegister.reset();
    }
  });
} catch {
  const formSearch = document.getElementById('search');
  formSearch.addEventListener('submit', e => {
    e.preventDefault();
    searchExpense();
  });
}


function createExpense() {
  const day = document.getElementById('day');
  const month = document.getElementById('month');
  const year = document.getElementById('year');
  const type = document.getElementById('type');
  const description = document.getElementById('description');
  const amount = document.getElementById('amount');

  const expense = new Expense(
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
    showSuccessModal();
    $('#modal-feedback').modal('show');
    return true;
  } else {
    showErrorModal();
    $('#modal-feedback').modal('show');
    return false;
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
  message.textContent = "Existem campos obrigat??rios que n??o foram preenchidos com dados v??lidos.";

  const title = modal.querySelector('.modal-title');
  title.textContent = "Erro na grava????o";
  title.className = 'modal-title text-danger';

  const btn = modal.querySelector('.btn');
  btn.className = 'btn btn-danger';
  btn.textContent = 'Fechar';
}

function getType(t) {
  switch(t) {
    case 1: return 'Alimenta????o';
    case 2: return 'Educa????o';
    case 3: return 'Lazer';
    case 4: return 'Sa??de';
    case 5: return 'Transporte';
    case 6: return 'Comunica????o';
    case 7: return 'Beleza';
    case 8: return 'Vestu??rio';
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

    const excludeCell = tr.insertCell(4);
    excludeCell.appendChild(createExcludeBtn(expense));
    
    tr.append(dateCell, typeCell, descriptionCell, amountCell, excludeCell);
    bodyTable.appendChild(tr);
  })
}

function searchExpense() {
  const expense = createExpense();
  const soughtExpenses = db.search(expense);
  loadExpensesList(soughtExpenses);
}

function createExcludeBtn(expense) {
    const excludeButton = document.createElement('button');
    excludeButton.className = 'border-0 bg-transparent fas fa-times';
    excludeButton.id = `id-expense-${expense.id}`;
    excludeButton.addEventListener('click', removeExpense);
    function removeExpense() {
      const id = this.id.replace('id-expense-', '');
      db.remove(id);
    }
    return excludeButton;
}