import { fetchJSON } from './fetch.js';
import { createItemButton } from './ui.js';


// ==========================================
// GLOBAL VARIABLES & DOM ELEMENTS 
// ==========================================
let itemData = null;
const curItems = []; 
const curItemSearchInput = document.querySelector('#curItemSearch');
const selectedContainer = document.querySelector('#selectedItems');
const clearBtn = document.querySelector('#clearBtn');


// ==========================================
// INITIALIZATION
// ==========================================
async function initApp() {
    itemData = await fetchJSON('../items.json');
    if (itemData) {
        console.log('Successfully loaded data:', itemData);

        // Used Google Gemini to help me write
        const container = document.querySelector('#availableItems');
        const itemNames = [
            ...itemData.components,
            ...Object.keys(itemData.recipes)
        ]
        const fragment = document.createDocumentFragment();
    
        itemNames.forEach(function(itemName) {
            fragment.appendChild(createItemButton(itemName, 'cur-item-btn', handleSelectItem));
        })
        container.appendChild(fragment);
    }
}


// ==========================================
// EVENT HANDLERS
// ==========================================
// Filter for items using user's search input
// Reference: https://www.w3schools.com/howto/howto_js_filter_lists.asp
function handleFilterSearch(event) {
    // Set input to lowercase + Strip punctuations and white space from input
    let searchTerm = event.target.value.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '').trim().toLowerCase();

    
    const allItems = document.querySelectorAll('.cur-item-btn');
    allItems.forEach(function(item) {
        const itemName = item.getAttribute('data-name')
        if (itemName.includes(searchTerm)) {
            item.style.display = '';
        }
        else {
            item.style.display = 'none';
        }
    });
}

// Display items the user has selected
function handleSelectItem(event) {
    const clickedButton = event.currentTarget;
    const itemName = clickedButton.getAttribute('data-name');
    selectedContainer.appendChild(createItemButton(itemName, 'selected-item-btn', handleRemoveItem));
    curItems.push(itemName);
    console.log(curItems);
}

// Remove item from selection
function handleRemoveItem(event) {
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
function handleClearItem() {
    curItems.length = 0;
    console.log(curItems);
    selectedContainer.replaceChildren();
}

// ==========================================
// EVENT LISTENERS
// ==========================================
curItemSearchInput.addEventListener('keyup', handleFilterSearch);
clearBtn.addEventListener('click', handleClearItem);

initApp();