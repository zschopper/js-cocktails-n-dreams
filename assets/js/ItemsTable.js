"use strict";

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
        return this;
    }

    buildTable() {
        let items = this.drinkList.filteredItemList
        console.log("buildTable", this.drinkList.filteredItemList);

        let table = $(this.container + " table");
        if (!table.length) { // table does not exists
            // console.log("Table DOES NOT exists");
            let thead = "";

            if (items.length > 0) {
                thead += "<tr>";
                // console.log(fieldDefs);
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
    }

    updateTableContent() {
        let items = this.drinkList.filteredItemList;
        let html = "";

        for (let index in items) {
            let item = items[index];

            html += `<tr data-id="${item.id}">`
            for (let field of this.drinkList.fieldDefs) {
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
    let idx = $(event.target).closest("*[data-id]").attr("data-id");
    console.log("deleteClick", idx)
    ItemsTable.instance.drinkList.deleteItem(idx);
    ItemsTable.instance.buildTable();
}

function editClick(event) {
    let idx = $(event.target).closest("*[data-id]").attr("data-id");
    // openModal(itemList[idx], fieldDefs, modalParent);
    console.log("editClick", idx);
    ItemsTable.instance.buildTable();
}

function sortColumnClick(event) {
    let target = $(event.target)

    if (target.attr("aria-sort") == "ascending") {
        target.attr("aria-sort", "descending");
    } else {
        $("th[aria-sort]").removeAttr("aria-sort");
        target.attr("aria-sort", "ascending");
    }
    console.log("sortcolumnclick", this);
    console.log("sortcolumnclick", $(this));
    console.log("sortcolumnclick", event);


    ItemsTable.instance.drinkList.sortItems(target.attr("data-key"), target.attr("aria-sort") === "ascending");
    ItemsTable.instance.buildTable();
}