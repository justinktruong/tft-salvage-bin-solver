// Sanitize search input
export function sanitizeSearch(searchInput) {
    if (!searchInput) return '';
    return searchInput.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, '').trim().toLowerCase();
}

// Calculate the number of components after breaking down completed items
export function calcNumberOfComponents(currentItems, itemData) {
    const count = {};
    currentItems.forEach((item) => {
        if (itemData.components.includes(item)) {
            count[item] = (count[item] || 0) + 1;
        }
        else if (itemData.recipes[item]) {
            itemData.recipes[item].forEach((component) => {
                count[component] = (count[component] || 0) + 1;
            });
        }
    })
    return count;
}

// Check if single component is in inventory
export function isComponentAvailable(component, itemData, compInventory) {
    return itemData.components.includes(component) && (compInventory[component] || 0) > 0;
}

// Check if item is buildable
export function isItemBuildable(item, itemData, compInventory) {
    const recipe = itemData.recipes[item];
    if (!recipe) return false;

    const requiredComponents = {};
    recipe.forEach(component => {
        requiredComponents[component] = (requiredComponents[component] || 0) + 1;
    });
    for (const component in requiredComponents) {
        const required = requiredComponents[component];
        const available = compInventory[component] || 0;
        if (available < required) return false;
    }

    return true;
}