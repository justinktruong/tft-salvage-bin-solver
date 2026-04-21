// Create HTML button elements for items
export function createItemButton(itemName, btnClass, btnFunction) {
    // Create item image element 
    const image = document.createElement('img');
    image.src = `./item-images/${itemName}.png`;
    image.alt = `${itemName}`;

    // Create button element
    const button = document.createElement('button');
    button.classList.add(...btnClass);
    button.setAttribute('data-name', itemName);
    button.appendChild(image);
    button.addEventListener('click', btnFunction);

    return button;
}

export function createItemIcon(itemName, iconClass) {
    const image = document.createElement('img');
    image.src = `./item-images/${itemName}.png`;
    image.alt = `${itemName}`;

    const wrapper = document.createElement('div');
    wrapper.classList.add(iconClass); 
    wrapper.setAttribute('data-name', itemName);
    wrapper.appendChild(image);

    return wrapper;
}