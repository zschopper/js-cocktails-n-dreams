"use strict";

import { Notifications } from "./notifications.js";

export class Basket extends Notifications {

    constructor() {
        if (Basket._instance) {
            console.warn("Already created");
            return Basket._instance;
        }
        super();
        this.addEventHandler("basketChange");
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

    setList(drinkList) {
        this.drinkList = drinkList;
        return this;
    }

    save() {
        let simpleBasket = {};
        this.items.map(elem => simpleBasket[elem.drink.id] = elem.amount);
        let basketStr = JSON.stringify(simpleBasket);
        console.log("Basket.save() basketStr", basketStr);
        localStorage.setItem("basket", basketStr);
        this.dispatchEvent("basketChange", this);
        return this;
    }

    load() {
        let basketStr = localStorage.getItem("basket");
        if (basketStr) {
            this.items = [];
            console.log("Basket.load() basketStr", basketStr, this.drinkList);
            let savedList = JSON.parse(basketStr);
            for (let drinkId in savedList) {
                let item = this.drinkList.findItemById(drinkId);
                console.log(item);

                let amount = savedList[drinkId];
                this.items.push({ drink: item, amount: amount });
            }
            console.log("Basket.load() basket", this.items);
            this.dispatchEvent("basketChange", this);
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
}

Basket._instance = null;