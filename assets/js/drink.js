export class Drink {

    constructor(values) {
        this.id = this.name = this.alcoholic = this.category = this.image = this.glass = this.iba = this.instructions = this.video = this.ingredients = undefined;
        for (const prop in this) {
            if (values.hasOwnProperty(prop)) {
                this[prop] = values[prop];
            } else {
                this[prop] = undefined;
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