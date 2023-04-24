"use strict";

import { EditUI } from "./editUI.js";

export class ItemsTable {

    constructor() {
        if (ItemsTable._instance) {
            console.warn("Already created")
            return ItemsTable._instance;
        }
        ItemsTable._instance = this;
        this.drinkList = null;
        this.container = "";
    }

    static get instance() {
        if (!ItemsTable._instance) {
            return new ItemsTable();
        }
        return ItemsTable._instance;
    }

    setContainer(container) {
        this.container = container;
        return this;
    }

    setList(drinkList) {
        this.drinkList = drinkList;
        this.drinkList.on("itemsChange", (event) => { this.itemsChangeCallback() });
        this.drinkList.on("itemsOrderChange", (event) => { this.itemsOrderChangeCallback() });

        return this;
    }

    itemsChangeCallback() {
        console.log("ItemsTable::itemsChangeCallback");
        ItemsTable.instance.updateTableContent();
    }


    itemsOrderChangeCallback() {
        console.log("ItemsTable::itemsOrderChangeCallback");
        ItemsTable.instance.updateTableContent();
    }

    buildTable() {
        let items = this.drinkList.filteredItemList
        let table = $(this.container + " table");
        if (!table.length) { // table does not exists
            let thead = "";

            if (items.length > 0) {
                thead += "<tr>";
                for (let field of this.drinkList.fieldDefs) {
                    if (field.displayOn.includes("table")) {
                        thead += `<th data-key="${field.name}" data-sortable="${field.sortable}">${field.title}</th>`;
                    }
                }
                thead += "<th></th></tr>";
            }
            $(this.container).append(
                `<table class="table table-striped table-hover table-responsive">` +
                `<thead class="table-dark">${thead}</thead>` +
                `<tbody></tbody>` +
                `</table>`);
            $(this.container + " table th[data-sortable='true']").off("click", sortColumnClick).on("click", sortColumnClick);

        } else {
            $(this.container + " table tbody").empty();
        }

        if (items.length > 0) {
            this.updateTableContent();
        } else {
            // this.container.append("<div/>").addClass("info").text("Nincs megjeleníhető elem");
        }
        return this;
    }

    updateTableContent() {
        let items = this.drinkList.filteredItemList;
        let html = "";

        for (let index in items) {
            let item = items[index];

            html += `<tr data-id="${item.id}">`
            for (let field of this.drinkList.fieldDefs) {
                if (field.displayOn.includes("table")) {
                    switch (field.displayAs) {
                        case "image":
                            html += `<td data-type="${field.displayAs}"><img src="${item[field.name]}"/></td>`;
                            break;

                        default:
                            html += `<td data-type="${field.displayAs}">${item[field.name]}</td>`;
                            break;
                    }
                }
            }

            html +=
                `<td><span class="data-operations">` +
                `<i class="fa-solid fa-edit edit"></i>&nbsp;` +
                `<i class="fa-solid fa-trash delete"></i>` +
                `</span></td>`;

            html += "</tr>";
        }
        $(this.container + " table tbody").empty().append(html);
        $(".data-operations .edit").on("click", editClick);
        $(".data-operations .delete").on("click", deleteClick);

        return this;
    }
}

ItemsTable._instance = null;

//refactor these function into the class

function deleteClick(event) {
    let idx = $(event.target).closest("*[data-id]").attr("data-id");
    ItemsTable.instance.drinkList.deleteItem(idx);
}

function editClick(event) {
    let id = $(event.target).closest("*[data-id]").attr("data-id");
    let drink = ItemsTable.instance.drinkList.findItemById(id);
    EditUI.instance.editItem(drink);
    // openModal(itemList[id], fieldDefs, modalParent);
    // console.log("editClick", id);
    // ItemsTable.instance.buildTable();
}

function sortColumnClick(event) {
    let target = $(event.target)

    if (target.attr("aria-sort") == "ascending") {
        target.attr("aria-sort", "descending");
    } else {
        $("th[aria-sort]").removeAttr("aria-sort");
        target.attr("aria-sort", "ascending");
    }

    ItemsTable.instance.drinkList.sortItems(target.attr("data-key"), target.attr("aria-sort") === "ascending");
}