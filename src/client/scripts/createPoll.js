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
  const allItems = document.querySelectorAll('.item');
  const itemLength = allItems.length;
  if (type === 'remove' && itemLength <= 2) return;
  if (type === 'remove') {
    itemContainer.removeChild(allItems[itemLength - 1]);
  } else if (type === 'add' && itemLength <= 7) {
    const postNumber = itemLength + 1;
    itemContainer.innerHTML += `<div class='item'><label for='item${postNumber}'>Item #${postNumber}</label><input type='text' name='item${postNumber}' id='item${postNumber}' required /></div`;
  }
}
