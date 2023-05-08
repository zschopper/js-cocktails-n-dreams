"use strict";

import Basket from "./basket.js";

class BasketUI {

    constructor() {
        if (BasketUI._instance) {
            console.warn("Already created");
            return BasketUI._instance;
        }
        BasketUI._instance = this;
        this.drinkList = null;
        this.checkoutContainer = "";
        this.basketBadgeContainer = "";
        this.basket = null;
    }

    static get instance() {
        if (!BasketUI._instance) {
            return new BasketUI();
        }
        return BasketUI._instance;
    }

    setCheckoutContainer(container) {
        this.checkoutContainer = container;
        return this;
    }

    setList(drinkList) {
        this.drinkList = drinkList;
        return this;
    }

    setBasket(basket) {
        this.basket = basket;
        $(window).on("basketChange", (event) => { this.basketChangeCallback() });
        return this;
    }

    setBasketBadgeContainer(container) {
        this.basketBadgeContainer = container;
        return this;
    }

    basketChangeCallback() {
        console.log("BasketUI::basketChangeCallback");
        this.updateBadge();
        this.updateBasketDialog();
    }

    updateBadge() {
        $("#basket-counter").text(this.recalcBasketSize())

    }

    updateBasketDialog() {
        let html = "";
        for (let basketId in this.basket.items) {
            let item = this.basket.items[basketId];
            html +=
                `<div class="list-group-item" data-basket-id="${basketId}" data-drink-id=${item.drink.id}>` +
                '  <div class="row">' +
                '    <div class="col-2">' +
                `      <img src="${item.drink.image}" alt="${item.drink.name}">` +
                '    </div>' +
                `    <div class="col-7"><span class="name">${item.drink.name} x${item.amount}</span></div>` +
                '    <div class="col-3">' +
                `      <div class="price">${item.drink.price * item.amount}</div>

                <a class="add-one" href="#">+1</a>
                <a class="remove-one" href="#">-1</a>
                <a class="remove-all" href="#">Remove</a>` +
                '    </div>' +
                '  </div>' +
                '</div>';
        }

        $(this.checkoutContainer).html(html);
        $("#basket-modal .card-footer").html("Total: $" + this.basket.total);
        $(this.checkoutContainer + " a.add-one").on("click", event => this.changeAmtClick(event, 1));
        $(this.checkoutContainer + " a.remove-one").on("click", event => this.changeAmtClick(event, -1));
        $(this.checkoutContainer + " a.remove-all").on("click", event => this.changeAmtClick(event, -1000));
    }

    recalcBasketSize() {
        let total = 0;
        for (let item of this.basket.items)
            total += item.amount;
        return total;
    }

    changeAmtClick(event, amount) {
        let basketId = $(event.target).closest("[data-basket-id]").data("basketId");
        let item = this.basket.items[basketId].drink;
        if (amount > 0) {
            this.basket.addItem(item, amount);
            console.log("addClick", basketId, item, amount);
        } else {
            this.basket.removeItem(item, -amount);
            console.log("removeClick", basketId, item, amount);
        }
    }

}

BasketUI._instance = null;

export default BasketUI;
