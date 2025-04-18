//Seleciona os elementos do formulário
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");
const form = document.querySelector("form");
const expenseList = document.querySelector("ul");
const expenseQuantity = document.getElementById("total-expenses");
const expenseTotal = document.querySelector("aside header h2");

amount.oninput = () => {
  //Evento que observa qualquer interação com o input

  // Validação do input para aceitar somente números. Primeiro obtém o valor atual e ignora as letras inseridas no input.
  let value = amount.value.replace(/\D/g, "");

  // Converte o valor do input de String para Number e o divide por 100 para transformar em centavos.
  value = Number(value) / 100;

  //Depois atualiza esse valor formatado para o mesmo input. E claro, usando uma expressão regular.
  amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
  // Formata o valor para o real brasileiro
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return value;
}

// Capitura o evento de submit para obter os valores
form.onsubmit = (e) => {
  // Previne o evento de reload da página
  e.preventDefault();

  // Cria um objeto com os detalhes na nova despesa
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  };

  // Chama a função de adicionar item à lista
  expenseAdd(newExpense);
};

// Adiciona um novo item na lista.
function expenseAdd(newExpense) {
  try {
    // Cria o elemento de li para adicionar à lista
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    // Cria o icone da categoria
    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.catecory_name);

    // Cria a informação da despesa
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    // Cria a categoria da despesa
    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    // Adicionar name e category em expenseInfo
    expenseInfo.append(expenseName, expenseCategory);

    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`;

    // Cria o ícone de remover
    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "img/remove.svg");
    removeIcon.setAttribute("alt", "remover");

    // Adiciona as informações no item
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

    // Adiciona item à lista
    expenseList.append(expenseItem);

    // Limpa o formulário
    formClear();

    // Atualiza os totais
    updateTotals();
  } catch (e) {
    alert("Não foi possível atualizar a lista de despesas!");
    console.log(e);
  }
}

// Atualiza os totais.
function updateTotals() {
  try {
    // Recupera quantos filhos têm na lista
    const items = expenseList.children;

    // Atualiza a quantidade de itens na lista
    expenseQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`;

    // Variável para incrementar o total
    let total = 0;

    // Percorre cada item (li) da lista (ul)
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount");

      // Remover caractetes não numéricos e substitui a vírgula pelo ponto.
      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".");

      // Converte o valor para float
      value = parseFloat(value);

      // Verifica de é um número válido
      if (isNaN(value)) {
        return alert("O valor não é número");
      }

      // Incrementar o valor
      total += Number(value);
    }

    // Cria a span para adicionar o R$ formatado.
    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";

    // Formata o valor e remove o R$ que será exibido pela small com um estilo customizado.
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");

    // Limpa o conteúdo do elemento
    expenseTotal.innerHTML = "";

    // Adiciona o símbolo da moeda e o valor total formatado
    expenseTotal.append(symbolBRL, total);
  } catch (e) {
    console.log(e);
    alert("Não foi possível atualizar os totais.");
  }
}

// Evento que captura o clique nos itens da lista
expenseList.addEventListener("click", function (e) {
  // Verificar se o elemento clicado é o ícone de remover.
  if (e.target.classList.contains("remove-icon")) {
    // Obtem a li pai do elemento clicado
    const item = e.target.closest(".expense");
    // Remove o item da lista
    item.remove();
  }
  updateTotals();
});

function formClear() {
  expense.value = "";
  category.value = "";
  amount.value = "";

  // Coloca o focus no input de amount
  expense.focus();
}
