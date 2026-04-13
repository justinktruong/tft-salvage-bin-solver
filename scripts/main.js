import { fetchJSON } from './fetch.js';
import { createItemButton, createItemIcon } from './ui.js';


// ==========================================
// GLOBAL VARIABLES & DOM ELEMENTS 
// ==========================================
let itemData = null;
const currentItems = []; 
const availableComponents = [];

const currentSearchInput = document.querySelector('#current-search');
const currentSelectedContainer = document.querySelector('#current-selected');
const currentClearBtn = document.querySelector('#current-clear');

const availableComponentsContainer = document.querySelector('#available-components');

// ==========================================
// INITIALIZATION
// ==========================================
async function initApp() {
    itemData = await fetchJSON('../items.json');
    if (itemData) {
        console.log('Successfully loaded data:', itemData);

        // Used Google Gemini to help me write
        const container = document.querySelector('#current-items');
        const itemNames = [
            ...itemData.components,
            ...Object.keys(itemData.recipes)
        ]
        const fragment = document.createDocumentFragment();
    
        itemNames.forEach((item) => {
            fragment.appendChild(createItemButton(item, 'current-item-btn', handleSelectItem));
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

    const allItems = document.querySelectorAll('.current-item-btn');
    allItems.forEach((item) => {
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
    currentSelectedContainer.appendChild(createItemButton(itemName, 'selected-item-btn', handleRemoveItem));
    currentItems.push(itemName);
    console.log('Selected Items:', currentItems);
    renderSalvagedComponents();
}

// Remove item from selection
function handleRemoveItem(event) {
    const clickedButton = event.currentTarget;
    const itemName = clickedButton.getAttribute('data-name');
    const index = currentItems.indexOf(itemName);
    if (index !== -1) {
        currentItems.splice(index, 1);
    }
    console.log('Selected Items:', currentItems);
    clickedButton.remove();
    renderSalvagedComponents();
}

// Clear all selected items
function handleClearItem() {
    currentItems.length = 0;
    console.log('Selected Items:', currentItems);
    currentSelectedContainer.replaceChildren();
    renderSalvagedComponents();
}

// Break down current items into components and render icons
function renderSalvagedComponents() {
    availableComponents.length = 0;
    availableComponentsContainer.replaceChildren();

    const fragment = document.createDocumentFragment();

    currentItems.forEach((item) => {
        if (itemData.components.includes(item)) {
            fragment.appendChild(createItemIcon(item, 'salvaged-item-icon'));
            availableComponents.push(item);
        }
        else {
            itemData.recipes[item].forEach((component) => {
                fragment.appendChild(createItemIcon(component, 'salvaged-item-icon'));
                availableComponents.push(component);
            });
        }
    });
    availableComponentsContainer.appendChild(fragment);

    console.log('Available Componets:', availableComponents);
}


// ==========================================
// EVENT LISTENERS
// ==========================================
currentSearchInput.addEventListener('keyup', handleFilterSearch);
currentClearBtn.addEventListener('click', handleClearItem);

initApp();