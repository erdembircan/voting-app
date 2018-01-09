import inputSegment from '../../../src/server/templates/partials/inputSegment.hbs';
import parseHtml from './util/parseHtml';

const addB = document.querySelector('#addItem');
const removeB = document.querySelector('#removeItem');

const itemContainer = document.querySelector('#itemContainer');

function addItem() {
  itemHandler('add');
}
function removeItem() {
  itemHandler('remove');
}

addB.addEventListener('click', (e) => {
  addItem();
});

removeB.addEventListener('click', (e) => {
  removeItem();
});

function itemHandler(type) {
  const allItems = document.querySelectorAll('#itemContainer .item');
  const itemLength = allItems.length;
  if (type === 'remove' && itemLength <= 2) return;
  if (type === 'remove') {
    itemContainer.removeChild(allItems[itemLength - 1]);
  } else if (type === 'add' && itemLength <= 7) {
    const postNumber = itemLength + 1;
    const inputElement = parseHtml(inputSegment({ itemNumber: postNumber }), itemContainer);

    itemContainer.appendChild(inputElement);
  }
}
