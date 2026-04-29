import { fetchJSON } from './fetch.js';
import { createItemButton, createItemIcon } from './ui.js';
import { sanitizeSearch, calcNumberOfComponents, isComponentAvailable, isItemBuildable} from './utils.js';


// ==========================================
// GLOBAL VARIABLES & DOM ELEMENTS 
// ==========================================
let itemData = null;
const currentItems = []; 
let availableComponents = {};
const builtItems = [];

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
    let searchTerm = sanitizeSearch(event.target.value);

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
    const button = event.currentTarget;
    const itemName = button.getAttribute('data-name');
    currentSelectedContainer.appendChild(createItemButton(itemName, ['selected-item-btn'], handleRemoveItem));
    currentItems.push(itemName);
    console.log('Selected Items:', currentItems);
    renderSalvagedComponents();
}

// Remove item from selection
function handleRemoveItem(event) {
    const button = event.currentTarget;
    const itemName = button.getAttribute('data-name');
    const index = currentItems.indexOf(itemName);
    if (index !== -1) {
        currentItems.splice(index, 1);
    }
    console.log('Selected Items:', currentItems);
    button.remove();
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
    availableComponentsContainer.replaceChildren();

    availableComponents = calcNumberOfComponents(currentItems, builtItems, itemData);
    const fragment = document.createDocumentFragment();
    for (const [component, count] of Object.entries(availableComponents)) {
        for (let i = 0; i < count; i++) {
            fragment.appendChild(createItemIcon(component, 'salvaged-item-icon'));
        }
    }
    availableComponentsContainer.appendChild(fragment);
    highlightBuildableItems();

    console.log('Available Componets:', availableComponents);
}

// Highlight buildable items
function highlightBuildableItems() {
    document.querySelectorAll('.target-item-btn').forEach((button) => {
        const item = button.getAttribute('data-name');
        if (isComponentAvailable(item, itemData, availableComponents) || 
            isItemBuildable(item, itemData, availableComponents)) {
            button.classList.remove('target-item-unavailable');
            button.disabled = false;
        }
        else {
            button.classList.add('target-item-unavailable');
            button.disabled = true;
        }
    });
}

// ==========================================
// EVENT LISTENERS
// ==========================================
currentSearchInput.addEventListener('keyup', handleFilterSearch);
currentClearBtn.addEventListener('click', handleClearItem);

initApp();