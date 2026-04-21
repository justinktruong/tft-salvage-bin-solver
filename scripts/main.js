import { fetchJSON } from './fetch.js';
import { createItemButton, createItemIcon } from './ui.js';


// ==========================================
// GLOBAL VARIABLES & DOM ELEMENTS 
// ==========================================
let itemData = null;
const currentItems = []; 
let availableComponents = {};

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
        const currentContainer = document.querySelector('#current-items');
        const targetContainer = document.querySelector('#target-items');
        const itemNames = [
            ...itemData.components,
            ...Object.keys(itemData.recipes)
        ]
        const currentFragment = document.createDocumentFragment();
        const targetFragment = document.createDocumentFragment();
    
        itemNames.forEach((item) => {
            currentFragment.appendChild(createItemButton(item, ['current-item-btn'], handleSelectItem));
            const targetBtn = createItemButton(item, ['target-item-btn', 'target-item-unavailable'], handleSelectItem);
            targetBtn.disabled = true; 
            targetFragment.appendChild(targetBtn);
        })
        currentContainer.appendChild(currentFragment);
        targetContainer.appendChild(targetFragment);
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
    currentSelectedContainer.appendChild(createItemButton(itemName, ['selected-item-btn'], handleRemoveItem));
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
    availableComponents = {};
    availableComponentsContainer.replaceChildren();

    const fragment = document.createDocumentFragment();

    currentItems.forEach((item) => {
        if (itemData.components.includes(item)) {
            fragment.appendChild(createItemIcon(item, 'salvaged-item-icon'));
            availableComponents[item] = (availableComponents[item] || 0) + 1;
        }
        else {
            itemData.recipes[item].forEach((component) => {
                fragment.appendChild(createItemIcon(component, 'salvaged-item-icon'));
                availableComponents[component] = (availableComponents[component] || 0) + 1;
            });
        }
    });
    availableComponentsContainer.appendChild(fragment);
    highlightCraftableItems();

    console.log('Available Componets:', availableComponents);
}

// Highlight craftable items
function highlightCraftableItems() {
    document.querySelectorAll('.target-item-btn').forEach((button) => {
        const item = button.getAttribute('data-name');
        if (isCraftable(item)) {
            button.classList.remove('target-item-unavailable');
            button.disabled = false;
        }
        else {
            button.classList.add('target-item-unavailable');
            button.disabled = true;
        }
    });
}

// Check if item is craftable
function isCraftable(item) {
    if (itemData.components.includes(item)) return (availableComponents[item] || 0) > 0;

    const requiredComponents = {};
    itemData.recipes[item].forEach(component => {
        requiredComponents[component] = (requiredComponents[component] || 0) + 1;
    });
    for (const component in requiredComponents) {
        const required = requiredComponents[component];
        const available = availableComponents[component] || 0;
        if (available < required) return false;
    }

    return true;
}

// ==========================================
// EVENT LISTENERS
// ==========================================
currentSearchInput.addEventListener('keyup', handleFilterSearch);
currentClearBtn.addEventListener('click', handleClearItem);

initApp();