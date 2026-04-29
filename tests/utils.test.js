import { describe, it, expect } from 'vitest';
import { sanitizeSearch, calcNumberOfComponents, isComponentAvailable, isItemBuildable } from './scripts/utils.js';

const ITEM_DATA = {
    'components': ['needlessly large rod', 'recurve bow', 'bf sword', 'sparring glove', 'tear of the goddess', 'giants belt', 'chain vest', 'negatron cloak'],
    'recipes': {
        'bramble vest': ['chain vest', 'chain vest'],
        'thiefs glove': ['sparring glove', 'sparring glove'],
        'deathblade': ['bf sword', 'bf sword'],
        'infinity edge': ['bf sword', 'sparring glove'],
        'steadfast heart': ['sparring glove', 'chain vest'],
        'edge of night': ['bf sword', 'chain vest'],
        'hextech gunblade':['needlessly large rod', 'bf sword']
    }
};


describe('sanitizeSearch', () => {
    it('Takes fully uppercase string and returns fully lowercase string', () => {
        expect(sanitizeSearch('BRAMBLE VEST')).toBe('bramble vest');
    });
    it('Strips punctuation from string', () => {
        expect(sanitizeSearch('B.F. sword?')).toBe('bf sword');
    });
    it('Ignores leading and trailing whitespace', () => {
        expect(sanitizeSearch('  giants belt   ')).toBe('giants belt');
    });
    it('Empty string returns \"\"', () => {
        expect(sanitizeSearch('')).toBe('');
    });
})


describe('calcNumberOfComponents', () => {
    it('Successfully adds one component', () => {
        expect(calcNumberOfComponents(['needlessly large rod'], [], ITEM_DATA)).toStrictEqual({'needlessly large rod': 1});
    });

    it('Successfully breaks down completed item to two components', () => {
        expect(calcNumberOfComponents(['infinity edge'], [], ITEM_DATA)).toStrictEqual({'bf sword': 1, 'sparring glove': 1});
    });

    it('Successfully increments the number of components when item has same components', () => {
        expect(calcNumberOfComponents(['chain vest', 'bramble vest', 'steadfast heart', 'chain vest'], [], ITEM_DATA)).toStrictEqual({'chain vest': 5, 'sparring glove': 1});
    });

    it('Successfully breaks down list of completed items and components', () => {
        const inventory = {
            'bf sword': 2, 
            'sparring glove': 1, 
            'needlessly large rod': 1, 
            'chain vest': 2,
            'recurve bow': 1
        };
        expect(calcNumberOfComponents(['infinity edge', 'needlessly large rod', 'bramble vest', 'bf sword', 'recurve bow'], [], ITEM_DATA)).toStrictEqual(inventory);
    });

    it('Successfully removes one component when component is built', () => {
        expect(calcNumberOfComponents(['needlessly large rod'], ['needlessly large rod'], ITEM_DATA)).toStrictEqual({'needlessly large rod': 0});
    });

    it('Successfully removes two component when item is built', () => {
        const selected = ['bramble vest', 'thiefs glove'];
        const built = ['steadfast heart'];
        const inventory = {
            'chain vest': 1,
            'sparring glove': 1
        };
        expect(calcNumberOfComponents(selected, built, ITEM_DATA)).toStrictEqual(inventory);
    });

    it('Successfully removes components from list of items built', () => {
        const selected = ['infinity edge', 'needlessly large rod', 'bramble vest', 'bf sword', 'recurve bow']
        const built = ['hextech gunblade', 'edge of night', 'steadfast heart'];
        const inventory = {
            'bf sword': 0, 
            'sparring glove': 0, 
            'needlessly large rod': 0, 
            'chain vest': 0,
            'recurve bow': 1
        };
        expect(calcNumberOfComponents(selected, built, ITEM_DATA)).toStrictEqual(inventory);
    });

    it('Returns empty object if lists are empty', () => {
        expect(calcNumberOfComponents([], [], ITEM_DATA)).toStrictEqual({});
    });
})


describe('isComponentAvailable', () => {
    it('Return true if target component is in inventory', () => {
        const inventory = { 
            'bf sword': 1,
            'sparring glove': 2,
            'chain vest': 3
        };
        expect(isComponentAvailable('bf sword', ITEM_DATA, inventory)).toBe(true);
    });

    it('Return false if target component is not in inventory', () => {
        const inventory = {
            'chain vest': 3,
            'giants belt': 1
        };
        expect(isComponentAvailable('needlessly large rod', ITEM_DATA, inventory)).toBe(false);
    });

    it('Return false if target component is not a component', () => {
        const inventory = { 
            'bf sword': 1
        };
        expect(isComponentAvailable('deathblade', ITEM_DATA, inventory)).toBe(false);
    });

    it('Return false if inventory is empty', () => {
        expect(isComponentAvailable('bf sword', ITEM_DATA, {})).toBe(false);
    });
})


describe('isItemBuildable', () => {
    it('Return true if target item has the neccessary components to be built', () => {
        const inventory = {
            'sparring glove': 1,
            'chain vest': 1
        };
        expect(isItemBuildable('steadfast heart', ITEM_DATA, inventory)).toBe(true);
    });

    it('Return true if target item requires duplicate components and inventory has enough', () => {
        const inventory = {
            'bf sword': 1,
            'sparring glove': 1,
            'chain vest': 3
        };
        expect(isItemBuildable('bramble vest', ITEM_DATA, inventory)).toBe(true);
    });

    it('Return false if target item does not have neccessary components to be built', () => {
        const inventory = {
            'bf sword': 1,
            'sparring glove': 1,
            'giants belt': 1
        };
        expect(isItemBuildable('hextech gunblade', ITEM_DATA, inventory)).toBe(false);
    });

    it('Return false if target item requires duplicate components but inventory only has one', () => {
        const inventory = {
            'bf sword': 1
        };
        expect(isItemBuildable('deathblade', ITEM_DATA, inventory)).toBe(false);
    });

    it('Return false if target item\'s recipe does not exist', () => {
        const inventory = {
            'chain vest': 3,
            'giants belt': 1
        };
        expect(isItemBuildable('rabadons deathcap', ITEM_DATA, inventory)).toBe(false);
    });

    it('Return false if target item is a component', () => {
        const inventory = {
            'bf sword': 1
        };
        expect(isItemBuildable('bf sword', ITEM_DATA, inventory)).toBe(false);
    });

    it('Return false if inventory is empty', () => {
        expect(isItemBuildable('steadfast heart', ITEM_DATA, {})).toBe(false);
    });
})