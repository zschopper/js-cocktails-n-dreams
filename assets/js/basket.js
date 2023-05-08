"use strict";

class Basket {

    constructor() {
        if (Basket._instance) {
            console.warn("Already created");
            return Basket._instance;
        }
        Basket._instance = this;
        this.drinkList = null;
        this.container = "";
        this.items = [];
        this._total = 0;

        this.basketChangeEvent = new CustomEvent("basketChange", { detail: { this: this } });

        document.addEventListener("visibilitychange", (event) => {
            if (!event.target.hidden)
                this.load();
        });

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

    setList(drinkList) {
        this.drinkList = drinkList;
        return this;
    }

    save() {
        let simpleBasket = {};
        this.recalcTotal();
        this.items.map(elem => simpleBasket[elem.drink.id] = elem.amount);
        let basketStr = JSON.stringify(simpleBasket);
        // console.log("Basket.save() basketStr", basketStr);
        localStorage.setItem("basket", basketStr);
        window.dispatchEvent(this.basketChangeEvent);
        return this;
    }

    load() {
        let basketStr = localStorage.getItem("basket");
        if (basketStr) {
            this.items = [];
            // console.log("Basket.load() basketStr", basketStr, this.drinkList);
            let savedList = JSON.parse(basketStr);
            for (let drinkId in savedList) {
                let item = this.drinkList.findItemById(drinkId);
                // console.log(item);

                let amount = savedList[drinkId];
                this.items.push({ drink: item, amount: amount });
            }
            this.recalcTotal();
            // console.log("Basket.load() basket", this.items);
            window.dispatchEvent(this.basketChangeEvent);
        }
        return this;
    }

    addItem(item, amount = 1) {
        let matches = this.items.filter(elem => elem.drink.name == item.name);
        if (matches.length) {
            matches[0].amount += amount;
            console.log("Basket.() incr", item.name, matches[0].amount);
        } else {
            this.items.push({ drink: item, amount: amount });
            console.log("Basket.() add", item.name, amount);
        }
        this.save();
        return this;
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
            this.save();
        }
        return this;
    }

    get total() {
        return this._total;
    }

    recalcTotal() {
        this._total = 0;
        for (let item of this.items) {
            this._total += item.drink.price * item.amount;
        }
        return this;
    }
}

Basket._instance = null;

export default Basket;
