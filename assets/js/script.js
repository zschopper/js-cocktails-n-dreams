"use strict";

import { ItemsTable } from "./ItemsTable.js";
// import { openModal } from "./modal.js";
// import {  } from "./utils.js";
import { Drinks } from "./drinks.js";
import { FilterUI } from "./filterUI.js";


$(function () {
    console.log("Right, let's go adventuring!");
    Drinks.loadItems();

    FilterUI.instance.initFields("#filter-container")
    ItemsTable.instance.setContainer("#table-container");

    Drinks.addFilters([
        { field: "category", value: "Shot" },
        { field: "alcoholic", value: "Alcoholic" },
        { field: "glass", value: "Shot glass" } ,
        { field: "alcoholic", value: "Alcoholic" }, // it should be filtered out: it's a dupe
    ]);


    ItemsTable.instance.buildTable(Drinks.filteredItemList);
});

function utils() {
}
