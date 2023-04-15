"use strict";

import { ItemsTable } from "./ItemsTable.js";
// import { openModal } from "./modal.js";
// import {  } from "./utils.js";
import { itemList, loadItems, filterItems } from "./items.js";
import { FilterUI } from "./filterUI.js";


$(function () {
    console.log("Right, let's go adventuring!");
    utils();
    loadItems();
    FilterUI.instance.initFields("#filter-container")
    ItemsTable.instance.setContainer("#table-container");

    // applyFilter()
    let filteredItemList = filterItems(["category: Shot", "alcoholic: Alcoholic", "glass: Shot glass"])

    ItemsTable.instance.buildTable(filteredItemList);
});

function utils() {
}
