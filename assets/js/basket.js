export class Basket {

    constructor() {
        if (Basket._instance) {
            console.warn("Already created");
            return Basket._instance;
        }
        Basket._instance = this;
        this.drinkList = null;
        this.container = "";
        this.items = [];
    }

    static get instance() {
        if (!Basket._instance) {
            return new Basket();
        }
        return Basket._instance;
    }

    setContainer(container) {
        this.container = container;
        return this;
    }

    addItem(item, amount = 1) {
        let matches = this.items.filter(elem => elem.drink.name == item.name);
        if (matches.length) {
            matches[0].amount += amount;
        } else {
            this.items.push({ drink: item, amount: amount });
        }
    }

    removeItem(item, amount = 1) {
        let matches = this.items.filter(elem => elem.drink.name == item.name);
        if (matches.length) {
            let itemToDelete = matches[0];
            itemToDelete.amount -= amount;
            if (itemToDelete.amount <= 0) {
                let idx = this.items.indexOf(itemToDelete);
                if (idx >= 0) {
                    this.items.splice(idx, 1);
                }
            }
        } else {
            this.items.push({ drink: item, amount: amount });
        }
    }
}

Basket._instance = null;