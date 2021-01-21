
/*Tutorial from https://freshman.tech/todo-list/ */

let todoItems = [];

function renderToDo (todo) {

  localStorage.setItem('todoItemsRef', JSON.stringify(todoItems));

  //prendo la lista
  const list = document.querySelector('.js-todo-list');
  const item = document.querySelector(`[data-key='${todo.id}']`);

  if (todo.deleted) {
    item.remove();
    return
  }

  const isChecked = todo.checked ? 'done' : '';

  //creo un nuovo nodo li
  const node = document.createElement('li');
  node.setAttribute('class', 'todo-item ' + isChecked);
  node.setAttribute('data-key', todo.id);
  node.innerHTML = `
    <input id="${todo.id}" type="checkbox" />
    <label for="${todo.id}" class="tick js-tick"></label>
    <span>${todo.text}</span>
    <button class="delete-todo js-delete-todo">
      <svg><use href="#delete-icon"></use></svg>
    </button>`;

  //se l'elemento esiste gia
  if (item) {
    //lo sostituisco
    list.replaceChild(node, item);
  } else {
    //lo aggiungo alla lista
    list.append(node);
  }
}


/*Prende il testo dall'input, crea un todo object e lo inserisce nell'array todoItems*/
function addToDo(text) {

  const toDo = {
    text: text,
    checked: false,
    id: Date.now()
  };

  todoItems.push(toDo);
  renderToDo(toDo);
}

function toggleDone (itemKey) {
  const index = todoItems.findIndex(item => {
    return item.id === Number(itemKey);
  });
  todoItems[index].checked = !todoItems[index].checked;
  renderToDo(todoItems[index]);
}

function deleteTodo (itemKey) {
  const index = todoItems.findIndex(item => {
    return item.id === Number(itemKey);
  });
  const todo = {
    deleted: true,
    ...todoItems[index]
  }

  todoItems = todoItems.filter(item => {
    return item.id !== Number(itemKey);
  });
  renderToDo(todo);
}

const form = document.querySelector('.js-form');

//On submit dell'elemento
form.addEventListener('submit', event => {
  event.preventDefault(); //evita page reloading
  const input = document.querySelector('.js-todo-input');

  //get inserted text and remove whitespace
  const text = input.value.trim();
  if (text !== '') {
    addToDo(text);
    input.value = '';
    input.focus();
  }
});

const list = document.querySelector('.js-todo-list');
list.addEventListener('click', event => {

  //se cliccato check item
  if (event.target.classList.contains('js-tick')) {
    const itemKey = event.target.parentElement.dataset.key;
    toggleDone(itemKey);
  }

  //se cliccato delete
  if (event.target.classList.contains('js-delete-todo')) {
    const itemKey = event.target.parentElement.dataset.key;
    deleteTodo(itemKey);
  }
});

//quando la pagina viene caricata, mostro i todo salvati
document.addEventListener('DOMContentLoaded', () => {
  const ref = localStorage.getItem('todoItemsRef');
  if (ref) {
    todoItems = JSON.parse(ref);
    todoItems.forEach(item => {
      renderToDo(item);
    });

  }
})
