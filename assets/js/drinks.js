"use strict";

import { Drink } from "./drink.js";

export class Drinks {

    constructor(dataFileName) {
        this.dataFileName = dataFileName;
        this.itemList = [];
        this.filteredItemList = [];
        this.fieldDefs = [];
        this.fieldValues = {};
        this.filters = [];
        this.fieldDefByName = {};
        this.initFieldDefs();
        this.eventHandlers = {
            "itemsChange": [],
            "filteredItemsChange": [],
            "filtersChange": [],
            "itemsOrderChange": [],
        };

    }

    // create object from field def list (for quicker access of fields by their name)

    initFieldDefs() {
        this.fieldDefs = [
            { name: "id", title: "#", displayAs: "number", displayOn: ["card", "table"], sortable: true, filter: "number", },
            { name: "name", title: "Name", displayAs: "text", displayOn: ["card", "table"], sortable: true, filter: "text", },
            { name: "category", title: "Category", displayAs: "text", displayOn: ["card", "table"], sortable: true, filter: "list", },
            { name: "alcoholic", title: "Alcoholic", displayAs: "text", displayOn: ["card", "table"], sortable: true, filter: "list", },
            { name: "image", title: "Image", displayAs: "image", displayOn: ["card"], sortable: false, filter: "", },
            { name: "glass", title: "Glass", displayAs: "text", displayOn: ["card", "table"], sortable: true, filter: "list", },
            { name: "iba", title: "IBA", displayAs: "text", displayOn: ["card", "table"], sortable: true, filter: "list", },
            { name: "instructions", title: "Instructions", displayAs: "text", displayOn: ["card"], sortable: false, filter: "", },
            { name: "noOfIngredients", title: "No. of Ingr.", displayAs: "number", displayOn: ["table"], sortable: true, filter: "", },
        ];

        this.fieldDefs.map((v, k) => { this.fieldDefByName[v.name] = v });
    }

    loadItems() {
        this.itemList = [];

        $.ajax({
            url: this.dataFileName,
            async: false,
            dataType: 'json',
            success: function (data) {
                console.log("loadItems", "load OK");
                this.fieldValues = {
                    alcoholic: [],
                    category: [],
                    glass: [],
                    iba: [],
                    ingredient: [],
                };

                for (let item of data) {
                    let values = {
                        id: item.no,
                        name: item.strDrink,
                        alcoholic: item.strAlcoholic,
                        category: item.strCategory,
                        image: item.strDrinkThumb,
                        glass: item.strGlass,
                        iba: item.strIBA,
                        instructions: item.strInstructions,
                        video: item.strVideo,
                        ingredients: [],
                    }

                    this.fieldValues["alcoholic"].push(values.alcoholic);
                    this.fieldValues["category"].push(values.category);
                    this.fieldValues["glass"].push(values.glass);
                    this.fieldValues["iba"].push(values.iba);
                    let i = 1;
                    while (item.hasOwnProperty("strIngredient" + i) && item["strIngredient" + i]) {
                        values.ingredients.push({
                            "measure": item["strMeasure" + i],
                            "ingredient": item["strIngredient" + i],
                        });
                        this.fieldValues["ingredient"].push(item["strIngredient" + i]);
                        i += 1;
                    }
                    this.itemList.push(new Drink(values));

                    // limit number of items - for testing
                    // if (this.itemList.length == 200)
                    //     break;
                }

                // make filter lists unique
                for (const key in this.fieldValues) {
                    this.fieldValues[key] = [... new Set(this.fieldValues[key])].sort().filter(item => item);
                    this.fieldValues[key].unshift("")
                }

                this.applyFilters();
                this.dispatchEvent("itemsChange", this);

            }.bind(this),
            fail: function () {
                console.warn("Loading items: An error has occurred.");
            }
        });
    }

    sortItems(field, ascending = true) {

        let fieldDef = this.fieldDefByName[field];
        this.filteredItemList.sort((a, b) => {

            let dir = 1;
            if (!ascending) {
                dir = -1;
            }

            switch (fieldDef.displayAs) {
                case "text":
                    return a[field].toString().localeCompare(b[field]) * dir;
                case "number":
                    return (a[field] - b[field]) * dir;
                default:
                    return 1;
            }
        });
        this.dispatchEvent("itemsChange", this);
        this.dispatchEvent("itemsOrderChange", this);
    }

    addFilter(field, value, suppress = false) {
        if (this.findFilter(field, value) == -1) {
            this.filters.push({ field: field, value: value });

            if (!suppress) {
                this.applyFilters()
            }
        }
    }

    removeFilter(field, value) {
        console.log("Drinks.removeFilter", field, value);

        let idx = this.findFilter(field, value);
        console.log("Drinks.removeFilter idx:", idx);
        if (idx >= 0) {
            this.filters.splice(idx, 1);
            this.applyFilters();
        }
    }

    findFilter(field, value) {
        // check existance of each filter in the filter list
        let idx = -1;
        for (let i = 0; idx == -1 && i < this.filters.length; i++) {
            if (this.filters[i].field == field && this.filters[i].value == value) {
                idx = i;
            }
        }
        return idx;
    }

    addFilters(items) {
        for (let item of items) {
            this.addFilter(item.field, item.value, true);
        }
        return this.applyFilters();
    }

    applyFilters() {

        let filterFields = {};

        for (let filter of this.filters) {

            if (filterFields[filter.field] == undefined) {
                filterFields[filter.field] = [filter.value];
            } else {
                filterFields[filter.field].push(filter.value);
            }

        }

        this.filteredItemList = this.itemList.filter((item) => {

            for (let key in filterFields) {

                let fieldDef = this.fieldDefByName[key];
                switch (fieldDef.filter) {
                    case "list":
                        if (!filterFields[key].includes(item[key])) {
                            return false;
                        }
                        break;
                    case "text":
                        console.log("text filter", filterFields[key], item[key]);
                        for (let filterVal of filterFields[key]) {
                            if (!item[key].toString().match(filterVal)) {
                                return false;
                            }
                        }
                        break;
                }

            }
            return true;
        });
        console.log("applyFilters", this.filters, this.filteredItemList);

        this.dispatchEvent("filtersChange", this);
        this.dispatchEvent("itemsChange", this);
        return this;
    }

    findIndexOfId(id) {
        let i = 0
        while (i < this.itemList.length && this.itemList[i].id != id) {
            i++;
        }

        if (i < this.itemList.length) {
            return i;
        }
        return -1;
    }

    editItem(data) {
        if (data.id !== undefined) {
            ;
        }
    }

    deleteItem(id) {
        let idx = this.findIndexOfId(id)
        this.itemList.splice(idx, 1);
        this.applyFilters();
        this.dispatchEvent("itemsChange", this);
        this.dispatchEvent("filteredItemsChange", this);

        // dispach a redraw ewent

    }

    on(event, callback) {
        if (Object.keys(this.eventHandlers).includes(event)) {
            this.eventHandlers[event].push(callback);
        } else {
            console.warn("Unknown event: ", event)
        }
        return this;
    }

    off(event, callback) {
        if (Object.keys(this.eventHandlers).includes(event)) {
            this.eventHandlers[event] = this.eventHandlers[event].filter(item => item != callback);
        } else {
            console.warn("Unknown event: ", event)
        }
        return this;
    }

    dispatchEvent(event, args) {
        console.log("Drinks.dispatchEvent", event);

        if (Object.keys(this.eventHandlers).includes(event)) {
            for (let callback of this.eventHandlers[event]) {
                callback(args);
            }
        } else {
            console.warn("Unknown event: ", event)
        }
        return this;
    }

}
