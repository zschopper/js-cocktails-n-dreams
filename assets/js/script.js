"use strict";

import { ItemsTable } from "./ItemsTable.js";
// import { openModal } from "./modal.js";
// import {  } from "./utils.js";
import { Drinks } from "./items.js";
import { FilterUI } from "./filterUI.js";


$(function () {
    console.log("Right, let's go adventuring!");
    utils();
    console.log("len before load", Drinks.itemList.length);
    Drinks.loadItems();
    console.log("len after load", Drinks.itemList.length);

    FilterUI.instance.initFields("#filter-container")
    ItemsTable.instance.setContainer("#table-container");

    // applyFilter()
    Drinks.filteredItemList = Drinks.filterItems(["category: Shot", "alcoholic: Alcoholic", "glass: Shot glass"])

    ItemsTable.instance.buildTable(Drinks.filteredItemList);
});

function utils() {
}
