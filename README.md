# App Orçamento Pessoal
## Introdução
Se trata de uma aplicação capaz de armazenar localmente despesas com uma descrição, data, tipo e valor.

## Tecnologias Utilizadas:
<ul>
  <li>
    <a href="https://developer.mozilla.org/docs/Web/HTML" target="_blank">HTML</a>  
  </li>
  <li>
    <a href="https://getbootstrap.com/docs/4.6/" target="_blank">Bootstrap 4.6</a>
  </li>
  <li>
    <a href="https://developer.mozilla.org/docs/Web/JavaScript" target="_blank">JavaScript</a>
  </li>
</ul>

# Como funciona
Veja a seguir como funcionam as principais funcionalidades desta aplicação:

1. [Registro de despesas](#registro-de-despesas)
2. [Armazenamento local das despesas](#armazenamento-local-das-despesas)
3. [Consulta de gastos anteriores](#consulta-de-gastos-anteriores)
4. [Filtragem entre as despesas](#filtragem-entre-as-despesas)
5. [Exclusão dinâmica de despesas](#exclusão-dinâmica-de-despesas)

<hr>

## Registro de despesas
Para que ocorra o registro de uma despesa o formulário de registro recebe um ouvinte para o evento de `submit` que executará a seguinte função de callback:

```javascript
  e => {
    e.preventDefault();
    const expense = createExpense(); 
    if(registerExpense(expense)){
      formRegister.reset();
    }
  }
```

1. A função `createExpense()` retorna um objeto com os atributos `day`, `month`, `year`, `type`, `description` e `amount` referentes aos campos preenchidos no formulário;

2. A função `registerExpense()`, deve receber como parâmetro um objeto que descreva o gasto para que haja a validação dos dados inseridos e retorna um valor `false` por padrão, ou `true` caso os dados sejam válidos.

<hr>

## Armazenamento local das despesas
Todo o armazenamento é feito através do objeto `localStorage` e para uma melhor manipulação dos dados no script foi necessária a criação da classe `Database`, sintetizada a seguir:

```javascript
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

  //----------------------

}
```
Os principais pontos a respeito dessa classe são:

1. Ela é instanciada para a constante `db` que, posteriormente, através do seu construtor, resgata o atributo `id`. Caso esta chave não exista ainda localmente, ela é criada com o valor de `0`;

2. Seu método `store(expense)` chama dentro do contexto do objeto o método `getNextId()` que retorna a chave posteriormente associada em `localStorage` ao objeto `expense` passado por parâmetro e convertido para JSON, além de alterar o próprio valor de `id` para um próximo armazenamento.

<hr>

## Consulta de gastos anteriores
Ao carregamento do `<body>` da página `consult.html` a instrução executada é:
```javascript 
  loadExpensesList(db.getAllRegisters())
```
1. O retorno do método `getAllRegisters()` de `db` é um array com todos os objetos da classe `Expense` que já foram armazenados localmente;

2. Estes objetos são obtidos através de uma estrutura `for` que itera sob o valor associado à chave `id` em `localStorage` e os adiciona à constante `expenses` quando seu valor não é nulo;

3. Já `loadExpensesList()` recebe por parâmetro o array `expenses` contendo as despesas e cria um elemento `<tr>` no HTML para cada posição, através do laço `forEach`, adicionando em `<td>`'s as informações de data, tipo, descrição, custo e um **[botão de exclusão](#exclusão-dinâmica-de-despesas)**;

4. Por fim, as linhas da tabela são exibidas no navegador.

<hr>

## Filtragem entre as despesas
Para que ocorra a filtragem das despesas, o formulário de pesquisa recebe um ouvinte para o evento de `submit` que executará uma função de callback que previne os comportamentos padrões de envio e chama a seguinte função: 
```javascript
function searchExpense() {
  const expense = createExpense();
  const soughtExpenses = db.search(expense);
  loadExpensesList(soughtExpenses);
}
```
1. É criado um objeto da classe `Expense` com os dados do formulário, de forma análoga ao processo de registro;

2. Em seguida, é executado o método `db.search()` que recebe como argumento o objeto `expense`. O método consiste em recuperar para o array `filtredExpenses` todos os registros através do método `db.getAllRegisters()`, avaliar os elementos do formulário que tiveram seu valor alterado, e filtrar este array através do método nativo `filter()`;

3. Por fim, o resultado da filtragem é exibido na tabela através da função `loadExpensesList`, [explicada anteriormente](#consulta-de-gastos-anteriores).

<hr>

## Exclusão dinâmica de despesas
Durante o processo de consulta das despesas é criado um botão que possui um ouvinte para seu evento de clique e internamente chamará o método `db.remove()` passando como argumento o `id` da despesa que será excluída do armazenamento local. Veja a seguir:
```javascript
class Database {
  //----------------------

  remove(id) {
      localStorage.removeItem(id);
  }
}
```

<hr>

## [Clique aqui para acessar!](https://murilosopi.github.io/app-orcamento-pessoal)
