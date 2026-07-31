// Seleciona os elementos do formulário.
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Seleciona os elementos da lista.
const expenseList = document.querySelector("ul")
const expenseQuantity = document.querySelector("aside header p span")
const expensesTotal =  document.querySelector("aside header h2")

// Captura o evento de input para formatar o valor.
amount.oninput = () => {
  // Obtém o valor atual do input e remove os caracteres não numéricos.
  let value = amount.value.replace(/\D/g, "")

  // Transforma o valor em centavos (exemplo: 150/100 = 1.5 que é equivalente a R$1,50).
  value = Number(value) / 100

  // Atualiza o valor do input.
amount.value = formatCurrencyBRL(value)
} 

function formatCurrencyBRL(value){
  // Formata o valor no padrão BRL (Real Brasileiro)
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  // Retorna o valor formatado.
  return value
}

// Captura o evento de submit do formulário para obter os valores.
form.onsubmit = (event) => {
  // Previne o comportamento padrão de recarregar a página.
  event.preventDefault()

  // Cria um objeto co mos detalhes na nova despesa.
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }

  // Chama a função que irá adicionar o item na lista
  expenseAdd(newExpense)
}

// Adiciona um novo item na lista.
function expenseAdd(newExpense) {
  try {
    // Cria o elemento para adicionar o item(li) na lista(ul).
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    // Cria o ícone de categoria.
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    // Cria a info da despesa.
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    // Cria o nome da despesa.
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    // Cria a categoria da despesa.
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    // Adiciona nome e categoria na div das informações da despesa.
    expenseInfo.append(expenseName, expenseCategory)

    // Cria o valor da despesa.
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

    // Cria o ícone de remover despesa.
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "img/remove.svg")
    removeIcon.setAttribute("alt", "remover")

    // Adiciona as informações no item.
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    // Adiciona o item na lista.
    expenseList.append(expenseItem)

    // Limpa o formulário para adicionar o item.
  formClear()

    // Atualiza os totais.
    updateTotals()
  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas")
    console.log(error)
  }
}

// Atualiza os totais
function updateTotals(){
  try {
    // Recupera todos os itens (li) da lista (ul)
    const items = expenseList.children
    
    // Atualiza a quantidade de itens da lista.
    expenseQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

    // Vaiável para incrementar o total de despesas.
    let total = 0

    // Percorre todos os itens da lista para somar os valores.
    for(let item = 0; item < items.length; item++){
      const itemAmount = items[item].querySelector(".expense-amount")
 
      // Remove os caracteres não numéricos e substitui pelo ponto
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(/\./g,"").replace(",",".")

      // Coverte o valor para float.
      value = parseFloat(value)

      // Verifica se é um número válido.
      if(isNaN(value)){
        return alert("Não foi poss´vel calcular o total. O valor não parece ser um número.")
      }
      
      // incremanta o valor total.
      total += Number(value)
    }

    //expensesTotal.textContent = formatCurrencyBRL(total)

    // Cria a span para adicionar o R$ formatado.
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"

    // Formato o valor e remove o R$ que será exibido pela small com um estilo customizado.
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

    // Limpa o conteúdo do elemento
    expensesTotal.innerHTML = ""

    // Adiciona o símbolo daa moeda e o valor total formatdado.
    expensesTotal.append(symbolBRL, total)
  } catch (error) {
    console.log(error)
    window.alert("Não foi possível atualizar os totais")
  }
}

// Evento que captura o click nos itens da lista.
expenseList.addEventListener("click", function(event) {
  // Verifica se o elemento clicado é o ícone de remover.
  if (event.target.classList.contains("remove-icon")){
    console.log(event)
    // Obtém a li pai do elemento clicado.
    const item = event.target.closest(".expense")

    // Remove o item da lista.
    item.remove()
  }

  // Atualiza os totais.
  updateTotals()
})

function formClear(){
  // Limpa os inputs
  expense.value = ""
  category.value = ""
  amount.value = ""

  // Coloca o foco no input de amount.
  expense.focus()
}
