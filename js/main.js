const compose = (...functions) => (data) =>
  functions.reduceRight((value, func) => func(value), data);

const description = document.querySelector('#description');
const calories = document.querySelector('#calories');
const carbs = document.querySelector('#carbs');
const protein = document.querySelector('#protein');

const arrOfInputs = document.querySelectorAll('input');

let list = [
  {
    description: 'manzana',
    calories: 10,
    carbs: 5,
    protein: 3
  },
  {
    description: 'naranja',
    calories: 15,
    carbs: 3,
    protein: 3
  },
  {
    description: 'pera',
    calories: 24,
    carbs: 34,
    protein: 23
  }
];

/**
  Ejemplo de lo que recibe y retorna esta función:
    {
      tag: 'h1',
    attr: {
      class: 'title'
    }
  }
  retorna un string -> "tag="h1" class="title""
 */
const attrsToString = (obj = {}) =>
  Object.keys(obj)
    .map((attr) => (`${attr}="${obj[attr]}"`))
    .join('');


const tagAttributes = obj => (content = '') =>
  `<${obj.tag}${obj.attrs ? ' ' : ''}${attrsToString(obj.attrs)}>${content}</${obj.tag}>`;

// Funcion que nos va a permitir crear nuestras etiquetas y asi rellenar la tabla
const tag = (newTag) =>
  typeof newTag === 'string' ? tagAttributes({ tag: newTag }) : tagAttributes(newTag);

const tableRowTag = tag('tr') //tr es cada fila
const tableRow = (items) => compose(tableRowTag, tableCells)(items);

const tableCell = tag('td') //td cada campo de la fila
const tableCells = (items) => items.map(tableCell).join('');

const trashIcon = tag({ tag: 'i', attrs: { class: 'fas fa-trash-alt' }})('');

const isValid = (element) => element.value;

const invalidShowed = (element) => isValid(element) ? '' : element.classList.add('is-invalid');

const addKeydownEvent = (element) =>
  element.addEventListener('keydown', () => element.classList.remove('is-invalid'));

arrOfInputs.forEach(addKeydownEvent);

const validateForm = () => description.value && calories.value && carbs.value && protein.value;

const cleanInputs = () => {
  description.value = '';
  carbs.value = '';
  calories.value = '';
  protein.value = '';
};

const updateTotals = () => {
  let calories = 0;
  let carbs = 0;
  let protein = 0

  list.map((item) => {
    calories += item.calories,
    carbs += item.carbs,
    protein += item.protein
  })

  document.querySelector('#totalCalories').textContent = calories;
  document.querySelector('#totalCarbs').textContent = carbs;
  document.querySelector('#totalProtein').textContent = protein;
}

const removeItem = (index) => {
  list.splice(index, 1);
  updateTotals();
  renderItems();
}

const renderItems = () => {
  let tbody = document.querySelector('tbody');
  tbody.innerHTML = '';

  list.map(({ description, calories, carbs, protein }, index) => {
    const removeButton = tag({
      tag: 'button',
      attrs: {
        class: 'btn btn-outline-danger',
        onclick: `removeItem(${index})`
      }
    })(trashIcon);

    tbody.innerHTML += tableRow([
			description,
			calories,
			carbs,
      protein,
      removeButton
		])
  })
}

const addValues = () => {
  const newItem = {
    description: description.value,
    calories: parseInt(calories.value),
    carbs: parseInt(carbs.value),
    protein: parseInt(protein.value)
  };
  list = [...list, newItem];
  updateTotals();
  cleanInputs();
  renderItems();
};

const validateInputs = () => {
  arrOfInputs.forEach((data) => invalidShowed(data));
  if(validateForm()) {
    addValues();
  }
}
