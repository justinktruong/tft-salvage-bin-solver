// ==========================================
// DOM ELEMENTS 
// ==========================================
const curItemSearchInput = document.querySelector('#curItemSearch'); 
const allItems = document.querySelectorAll('.cur-item-btn');
const curItems = [];

const selectedContainer = document.querySelector('#selectedItems');
const clearBtn = document.querySelector('#clearBtn');

// ==========================================
// FUNCTIONS
// ==========================================
// Filter for items using user's search input
// Reference: https://www.w3schools.com/howto/howto_js_filter_lists.asp
function filterSearch(event) {
    // Set input to lowercase + Strip punctuations and white space from input
    let searchTerm = event.target.value.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '').trim().toLowerCase();

    allItems.forEach(function(item) {
        const itemName = item.getAttribute('data-name')
        if (itemName.includes(searchTerm)) {
            item.style.display = '';;
        }
        else {
            item.style.display = 'none';    // Hide items that do not match input
        }
    });
}

// Display items the user has selected
function selectItem(event) {
    const clickedButton = event.currentTarget;
    const itemName = clickedButton.getAttribute('data-name');

    // Create item image element 
    const itemImage = document.createElement('img');
    itemImage.src = `/static/item_images/${itemName}.png`;
    itemImage.alt = `${itemName}`;

    // Create button element
    const newItem = document.createElement('button');
    newItem.classList.add('selected-item-btn');
    newItem.setAttribute('data-name', itemName);
    newItem.appendChild(itemImage);
    newItem.addEventListener('click', removeItem);

    curItems.push(itemName);
    console.log(curItems);
    selectedContainer.appendChild(newItem);
}

// Remove item from selection
function removeItem(event) {
    const clickedButton = event.currentTarget;
    const itemName = clickedButton.getAttribute('data-name');
    const index = curItems.indexOf(itemName);
    if (index !== -1) {
        curItems.splice(index, 1);
    }
    console.log(curItems);
    clickedButton.remove();
}

// Clear all selected items
function clearItem() {
    curItems.length = 0;
    console.log(curItems);
    selectedContainer.replaceChildren();
}

// ==========================================
// EVENT LISTENERS
// ==========================================
curItemSearchInput.addEventListener('keyup', filterSearch);

allItems.forEach(function(item) {
    item.addEventListener('click', selectItem);
});

clearBtn.addEventListener('click', clearItem);