export class Drink {

    constructor(values = undefined) {
        this.id = this.name = this.alcoholic = this.category = this.image = this.glass = this.iba = this.instructions = this.video = undefined;
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