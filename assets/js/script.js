"use strict";

import { ItemsTable } from "./ItemsTable.js";
// import { openModal } from "./modal.js";
import { Drinks } from "./drinks.js";
import { FilterUI } from "./filterUI.js";
import { EditUI } from "./editUI.js";

$(function () {
    console.log("Right, let's go adventuring!");
    let drinkList = new Drinks('assets/data/all_drinks.json');
    drinkList.loadItems();

    FilterUI.instance
        .setList(drinkList)
        .initFields("#filter-container")

    // drinkList.addFilters([
    //     { field: "category", value: "Shot" },
    //     { field: "alcoholic", value: "Alcoholic" },
    //     { field: "glass", value: "Shot glass" },
    //     { field: "alcoholic", value: "Alcoholic" }, // it should be filtered out: it's a dupe
    // ]);

    ItemsTable.instance
        .setContainer("#table-container")
        .setList(drinkList)
        .buildTable();

    EditUI.instance
        .setContainer("#drinksModal")
        .setList(drinkList);
});
