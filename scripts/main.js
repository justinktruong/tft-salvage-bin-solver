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

const targetSearchInput = document.querySelector('#target-search');
const availableComponentsContainer = document.querySelector('#available-components');
const targetSelectedContainer = document.querySelector('#target-selected');
const targetClearBtn = document.querySelector('#target-clear');


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
            currentFragment.appendChild(createItemButton(item, ['current-item-btn'], (e) => handleSelectItem(e, currentItems, currentSelectedContainer)));
            const targetBtn = createItemButton(item, ['target-item-btn', 'target-item-unavailable'], (e) => handleSelectItem(e, builtItems, targetSelectedContainer));
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
function handleFilterSearch(event, buttons) {
    // Set input to lowercase + Strip punctuations and white space from input
    let searchTerm = sanitizeSearch(event.target.value);

    const allItems = document.querySelectorAll(buttons);
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
function handleSelectItem(event, itemArray, itemContainer) {
    const button = event.currentTarget;
    const itemName = button.getAttribute('data-name');
    itemContainer.appendChild(createItemButton(itemName, ['selected-item-btn'], (e) => handleRemoveItem(e, itemArray)));
    itemArray.push(itemName);
    console.log('Selected Items:', currentItems);
    console.log('Built Items:', builtItems);
    renderSalvagedComponents();
}

// Remove item from selection
function handleRemoveItem(event, itemArray) {
    const button = event.currentTarget;
    const itemName = button.getAttribute('data-name');

    const index = itemArray.indexOf(itemName);
    if (index !== -1) {
        itemArray.splice(index, 1);
    }

    // Reset built items to recalculate components
    if (itemArray === currentItems) {
        builtItems.length = 0;
        targetSelectedContainer.replaceChildren();
    }

    console.log('Selected Items:', currentItems);
    button.remove();
    renderSalvagedComponents();
}

// Clear all selected items
function handleClearItem(itemArray) {
    if (itemArray === currentItems) {
        currentItems.length = 0;
        currentSelectedContainer.replaceChildren();
    }

    builtItems.length = 0;
    targetSelectedContainer.replaceChildren();

    console.log('Selected Items:', currentItems);
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

    console.log('Available Components:', availableComponents);
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
currentSearchInput.addEventListener('keyup', (e) => handleFilterSearch(e, '.current-item-btn'));
targetSearchInput.addEventListener('keyup', (e) => handleFilterSearch(e, '.target-item-btn'));

currentClearBtn.addEventListener('click', () => handleClearItem(currentItems));
targetClearBtn.addEventListener('click', () => handleClearItem(builtItems));

initApp();