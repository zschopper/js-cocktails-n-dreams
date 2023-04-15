"use strict";

import { fieldDefs, filteredItemList, itemList, sortItems } from "./items.js";

export class ItemsTable {

    constructor() {
        if (ItemsTable._instance) {
            console.warn("Already created")
            return ItemsTable._instance;
        }
        ItemsTable._instance = this;
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

    buildTable(items) {
        let table = $(this.container + " table");
        if (!table.length) { // table does not exists
            // console.log("Table DOES NOT exists");
            let thead = "";

            if (items.length > 0) {
                thead += "<tr>";
                // console.log(fieldDefs);
                for (let field of fieldDefs) {
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

            $(this.container + " table th[data-sortable='true']").off().on("click", thClick);

        } else {
            $(this.container + " table tbody").empty();
        }

        if (items.length > 0) {
            this.updateTableContent(items);
        } else {
            // this.container.append("<div/>").addClass("info").text("Nincs megjeleníhető elem");
        }
    }

    updateTableContent(items) {
        let html = "";
        for (let index in items) {
            let item = items[index];

            html += `<tr data-internalid="${index}">`
            for (let field of fieldDefs) {
                if (field.displayOn.includes("table")) {
                    switch(field.displayAs) {
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
    }
}

ItemsTable._instance = null;

function deleteClick(event) {
    let idx = $(event.target).closest("*[data-internalid]").attr("data-internalid");
    console.log("deleteClick", idx)
    itemList.splice(idx, 1);
    ItemsTable.instance.buildTable(filteredItemList);
}

function editClick(event) {
    let idx = $(event.target).closest("*[data-internalid]").attr("data-internalid");
    // openModal(itemList[idx], fieldDefs, modalParent);
    console.log("editClick", idx);
    ItemsTable.instance.buildTable(filteredItemList);
}

function thClick(event) {
    let target = $(event.target)

    if (target.attr("aria-sort") !== undefined) {
        if (target.attr("aria-sort") == "ascending")
            target.attr("aria-sort", "descending");
        else if (target.attr("aria-sort") == "descending")
            target.attr("aria-sort", "ascending");
    } else {
        $("th[aria-sort]").removeAttr("aria-sort");
        target.attr("aria-sort", "ascending");
    }
    sortItems(target.attr("data-key"), target.attr("aria-sort") === "ascending");
    ItemsTable.instance.buildTable(filteredItemList);

}