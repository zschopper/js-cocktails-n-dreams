"use strict";

export class Drink {

    constructor(values = undefined) {
        this.id = undefined;
        this.name = undefined;
        this.alcoholic = undefined;
        this.category = undefined;
        this.image = undefined;
        this.glass = undefined;
        this.price = undefined;
        this.iba = undefined;
        this.instructions = undefined;
        this.video = undefined;
        this.ingredients = [];
        if (values !== undefined) {
            for (const prop in this) {
                if (values.hasOwnProperty(prop)) {
                    this[prop] = values[prop];
                } else {
                    this[prop] = undefined;
                }
            }
        }
    }

    get noOfIngredients() {
        return this.ingredients.length;
    }

    contains(what) {
        return this.ingredients.includes(what);
    }
}