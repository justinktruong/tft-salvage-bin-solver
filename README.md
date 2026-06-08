# TFT Salvage Bin Solver

TFT Salvage Bin Solver is a client-side web application designed for Teamfight Tactics players to seamlessly break down items into their base components and dynamically calculate all possible valid item recipes in real-time.

## Live Website & Demo
* **Live Application:** [justinktruong.github.io/tft-salvage-bin-solver](https://justinktruong.github.io/tft-salvage-bin-solver/)
* **Video Walkthrough:** [YouTube Video Demo](https://youtu.be/ExxDVdsCL7w)

## Description

The application is divided into two sections: 

### 1. Select Your Current Items
* **Inventory Input:** Users can select full items or base components they currently own in-game. Items selected will populate in the "Selected Items" tray.
* **Input Sanitization Search:** Includes an search filter that automatically sanitizes user input— trimming leading/trailing whitespace, stripping punctuation, and ignoring case sensitivity.
* **State Reset Handling:** Users can remove individual selections by clicking on an item inside the "Selected Items" tray or reset their entire selection with the "Clear" button.

### 2. Select Your Target Items
* **Dynamic Breakdown Pool:** Displays the breakdown of components extracted from the full items and components in the previous section. 
* **Recipe Validation:** All target item buttons are initially disabled and greyed out. The app continuously passes inventory states through a frequency-counter validation algorithm. When a recipe's requirements are fully met, the corresponding item dynamically lights up and becomes clickable.
* **Item Building & Dismantling:** Clicking a highlighted target item "builds" it, actively removing the required components from your available pool. You can click the built item again to dismantle it, re-adding those components back to the pool.
* **Desync Prevention:** If you remove an item from your Current Items section, the app automatically resets your built Target Items to prevent desync errors and negative component counts.

## Built With

* **Frontend**: JavaScript (ES6 Modules), HTML5, CSS3
* **Testing**: Vitest