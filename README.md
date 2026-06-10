# TFT Salvage Bin Solver

TFT Salvage Bin Solver is a client-side web application designed for Teamfight Tactics players to seamlessly break down items into their base components and dynamically calculate all possible valid item recipes in real time.

## Live Website & Demo
* **Live Application:** [justinktruong.github.io/tft-salvage-bin-solver](https://justinktruong.github.io/tft-salvage-bin-solver/)
* **Video Walkthrough:** [YouTube Video Demo](https://youtu.be/ExxDVdsCL7w)


## Description

The application is divided into two sections: 

### 1. Select Your Current Items
* **Inventory Input:** Users can select full items or base components they currently own in-game. Items selected will populate in the "Selected Items" tray.
* **Input Sanitization Search:** Includes a search filter that automatically sanitizes user input— trimming leading/trailing whitespace, stripping punctuation, and ignoring case sensitivity.
* **State Reset Handling:** Users can remove individual selections by clicking on an item inside the "Selected Items" tray or reset their entire selection with the "Clear" button.

### 2. Select Your Target Items
* **Dynamic Breakdown Pool:** Displays the breakdown of components extracted from the full items and components in the previous section. 
* **Recipe Validation:** All target item buttons are initially disabled and greyed out. The app continuously passes inventory states through a frequency-counter validation algorithm. When a recipe's requirements are fully met, the corresponding item dynamically lights up and becomes clickable.
* **Item Building & Dismantling:** Clicking a highlighted target item "builds" it, actively removing the required components from your available pool. You can click the built item again to dismantle it, re-adding those components back to the pool.
* **Desync Prevention:** If you remove an item from your Current Items section, the app automatically resets your built Target Items to prevent desync errors and negative component counts.

---

## Project Structure & File Details

### Built With

* **Frontend**: JavaScript (ES6 Modules), HTML5, CSS3
* **Testing**: Vitest


### Webpage
* `index.html`: Provides the HTML skeleton for the web app. It is divided into "Current Items" and "Target Items" sections, where a JavaScript script dynamically populates it with elements based on data from `items.json`. It also links all the modular JavaScript files.
* `styles.css`: Contains all styling, layouts, and responsive CSS grids. It handles visual states dynamically, such as using opacity and pointer events to visually disable target items when component requirements are not met.
* `items.json`: A static data file acting as the application's database. It holds the master lists of all base components and the specific recipes for every buildable item. This file is served to `main.js` to generate HTML elements and inform the calculation logic.

### Scripts
* `main.js`: Connects the webpage, user inputs, and pure logic together. It handles all high-level DOM event listeners (clicks, inputs), manages the currentItems and builtItems state arrays, and coordinates UI updates.
* `ui.js`: Contains reusable functions (e.g. `createItemIcon`, `createItemButton`) to generate HTML elements dynamically.
* `utils.js`: Contains functions that handle the core logic of the web application. 
    * `sanitizeSearch` sanitizes user inputs in the search bars. 
    * `calcNumberOfComponents` calculates the available pool of base components after breaking down the user's selected items.
    * `isComponentAvailable` checks if a base component is available to be highlighted in the Target Item tray.
    * `isItemBuildable` checks if an item can be crafted based on the user's available components to be highlighted in the Target Item tray.
* `fetch.js`: Contains a utility function called fetchJSON to safely retrieve the data from items.json. The function includes error handling to throw an alert if it fails to fetch the data.

### Tests
* `main.test.js`: Contains the Vitest unit testing suite for the functions inside `utils.js`. It validates the correctness of functions' logic, duplicate component requirements (e.g., needing two of the same item), and edge cases like empty inventories.

---

## Design Choice

### Client-side vs. Server-side
Originally, I planned to use Python and Flask for the backend of the web app, and Jinja templating to help create HTML elements from the data in `items.json`. However, my vision for the project relies purely on math logic and user input. I did not need a Python backend for my project since my app will not handle anything heavy, such as managing a database or utilizing Riot's API. I decided to transition to a fully client-side app that only utilizes JavaScript and HTML. I created `fetch.js` to handle fetching data from `items.json`, and `ui.js` to handle the creation of HTML elements since I am moving away from Flask and Jinja. I also merged all my HTML files into one single file called `index.html`. 

### State-Driven UI
I needed a way to handle the component data when a user interacts with the app. I initially thought about dynamically updating the data whenever the user adds or removes items and components from their "inventory". However, manually incrementing and decrementing the component counts becomes complicated and prone to bugs when I add more ways to add and remove components. For example, in the first section, a user selects a B.F. Sword and Blue Buff, which adds a sword and two tears. In the second section, the user chooses to build a Spear of Shojin, removing the sword and tear. If the user decides to remove the B.F. Sword from the first section, then I need to dismantle the Spear of Shojin, readd the sword and tear, and remove the sword to correctly update the data. This method also becomes more flawed when I have multiple items built that use similar components. If I remove a B.F. Sword from the first section, but I have two items that use a B.F. Sword, which item do I remove the sword from?

To prevent desync bugs, I decided to implement a state-driven UI. I have two arrays that act as the component's source of truth: `currentItems` holds items and components the user chose in the first section, and `builtItems` holds items the user chose to build in the second section. Whenever the user interacts with the app, the following logic is executed:
1. The application completely clears the `availableComponents` dictionary and deletes the DOM container.
2. The application iterates through the `currentItems` array and recalculates the total number of components.
3. The application iterates through the `builtItems` array and decrements the number of components based on which item has been built.
4. The application renders the UI based on the updated data structures.

Since the application always recalculates the state from scratch, it is impossible for the UI to display the wrong items or have desync errors. This made the codebase significantly simpler, cleaner, and easier to unit test.