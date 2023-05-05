"use strict";

import ItemsTable from "./itemsTable.js";
import ItemsGallery from "./itemsGallery.js";
import Drinks from "./drinks.js";
import FilterUI from "./filterUI.js";
import EditUI from "./editUI.js";
import Basket from "./basket.js";
import BasketUI from "./basketUI.js";

$(function () {
    console.log("Right, let's go adventuring!");
    let in_admin_mode = window.location.pathname.split("/").pop() == "admin.html";
    let drinkList = new Drinks('assets/data/all_drinks.json')
        .loadItems();

    if (in_admin_mode) {

        FilterUI.instance
            .setList(drinkList)
            .setContainer("#filter-container")
            .setBadgeContainer("#filter-badge-container");

        ItemsTable.instance
            .setContainer("#table-container")
            .setList(drinkList)
            .buildTable();

        EditUI.instance
            .setContainer("#drinksModal")
            .setList(drinkList);
    } else {
        ItemsGallery.instance
            .setContainer("#gallery-container")
            .setList(drinkList)
            .renderItems();

        Basket.instance
            .setContainer("#drinksModal")
            .setList(drinkList);

        BasketUI.instance
            .setBasketBadgeContainer("#basket-badge")
            .setCheckoutContainer("#basket-checkout-container")
            .setBasket(Basket.instance);

        Basket.instance.load();

        // quick (delayed) name filter on text box
        $("#filter-by-name").on("input", event => {
            let value = $("#filter-by-name").val()
            // console.log("input!", value);
            drinkList.nameFilter = value;
        })
    }

});


