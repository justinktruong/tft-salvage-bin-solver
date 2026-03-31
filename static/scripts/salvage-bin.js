// ==========================================
// DOM ELEMENTS 
// ==========================================
const searchInput = document.querySelector('#itemSearch'); 
const allItems = document.querySelectorAll('.item-btn');

const selectedContainer = document.querySelector('#selected-items');
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
    newItem.appendChild(itemImage);
    newItem.addEventListener('click', removeItem);

    selectedContainer.appendChild(newItem);
}

// Remove item from selection
function removeItem(event) {
    const clickedButton = event.currentTarget;
    clickedButton.remove();
}

// Clear all selected items
function clearItem() {
    selectedContainer.replaceChildren();
}

// ==========================================
// EVENT LISTENERS
// ==========================================
searchInput.addEventListener('keyup', filterSearch);

allItems.forEach(function(item) {
    item.addEventListener('click', selectItem);
});

clearBtn.addEventListener('click', clearItem);