"use strict";

import Drink from "./drink.js";

class Drinks {

    constructor(dataFileName) {
        this._newId = 0;
        this.dataFileName = dataFileName;
        this.itemList = [];
        this.filteredItemList = [];
        this.fieldDefs = [];
        this.fieldValues = {};
        this._nameFilter = "";
        this.filters = [];
        this.fieldDefByName = {};
        this.initFieldDefs();

        this.itemsChangeEvent = new CustomEvent("itemsChange", { detail: { this: this } });
        this.filteredItemsChangeEvent = new CustomEvent("filteredItemsChange", { detail: { this: this } });
        this.filtersChangeEvent = new CustomEvent("filtersChange", { detail: { this: this } });
        this.itemsOrderChangeEvent = new CustomEvent("itemsOrderChange", { detail: { this: this } });
    }

    get nameFilter() {
        return this._nameFilter;
    }

    set nameFilter(value) {
        let delayMS = 500;
        this._nameFilter = value;
        {
            let oldValue = this._nameFilter;
            new Promise(resolve => setTimeout(resolve, delayMS)).then((newValue = this._nameFilter) => {
                // console.log(`nameFilter old: ${oldValue} new: ${newValue}`);
                if (newValue == oldValue) {
                    // console.log(`nameFilter: filter will be applied`);
                    this.applyFilters();
                }
            });
        }
    }

    initFieldDefs() {
        this.fieldDefs = [
            { name: "id", title: "#", displayAs: "number", displayOn: ["card", "table"], sortable: true, filter: "number", },
            { name: "name", title: "Name", displayAs: "text", displayOn: ["card", "table"], sortable: true, filter: "text", },
            { name: "category", title: "Category", displayAs: "text", displayOn: ["card", "table"], sortable: true, filter: "list", },
            { name: "alcoholic", title: "Alcoholic", displayAs: "text", displayOn: ["card", "table"], sortable: true, filter: "list", },
            { name: "price", title: "Price", displayAs: "number", displayOn: ["card", "table"], sortable: true, filter: "", },
            { name: "image", title: "Image", displayAs: "image", displayOn: ["card"], sortable: false, filter: "", },
            { name: "glass", title: "Glass", displayAs: "text", displayOn: ["card", "table"], sortable: true, filter: "list", },
            { name: "iba", title: "Intl. Bartenders Assoc.", displayAs: "text", displayOn: ["card", "table"], sortable: true, filter: "list", },
            { name: "instructions", title: "Instructions", displayAs: "text", displayOn: ["card"], sortable: false, filter: "", },
            { name: "ingredients", title: "Ingredients", displayAs: "text", displayOn: ["card"], sortable: false, filter: "", },
            { name: "noOfIngredients", title: "No. of Ingr.", displayAs: "number", displayOn: ["table"], sortable: true, filter: "", },
        ];

        // Areate object from field def list (for quicker access of fields by their name)
        this.fieldDefByName = [];
        this.fieldDefs.map((v, k) => { this.fieldDefByName[v.name] = v });
    }

    loadItems(signature = true) {
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
                    if (signature && !item.signature)
                        continue;
                    let values = {
                        id: item.no,
                        name: item.strDrink,
                        category: item.strCategory,
                        alcoholic: item.strAlcoholic,
                        price: item.fakePrice,
                        image: item.strDrinkThumb,
                        glass: item.strGlass,
                        iba: item.strIBA ? item.strIBA : "Not Classified",
                        instructions: item.strInstructions,
                        video: item.strVideo,
                        ingredients: [],
                    }

                    if (this._newId < item.no) {
                        this._newId = item.no;
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
                window.dispatchEvent(this.itemsChangeEvent);

            }.bind(this),
            fail: function () {
                console.warn("Loading items: An error has occurred.");
            }
        });
        return this;
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
        window.dispatchEvent(this.itemsChangeEvent);
        window.dispatchEvent(this.itemsOrderChangeEvent);
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
        let idx = this.findFilter(field, value);
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

            if (this._nameFilter) {
                let rx = new RegExp(this._nameFilter, "i");
                if (!item.name.toString().match(rx)) {
                    let found = false;
                    for (let ingr of item.ingredients) {
                        // console.log("ingr", ingr.ingredient );

                        found = found || ingr.ingredient.toString().match(rx)
                    }

                    return found;
                }
            }

            for (let key in filterFields) {
                let fieldDef = this.fieldDefByName[key];
                switch (fieldDef.filter) {
                    case "list":
                        if (!filterFields[key].includes(item[key])) {
                            return false;
                        }
                        break;
                    case "text":
                        for (let filterVal of filterFields[key]) {
                            let rx = new RegExp(filterVal, "i");
                            if (!item[key].toString().match(rx)) {
                                return false;
                            }
                        }
                        break;
                }
            }
            return true;
        });
        // console.log("applyFilters", this.filters, this.filteredItemList);

        window.dispatchEvent(this.filtersChangeEvent);
        window.dispatchEvent(this.itemsChangeEvent);
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

    findItemById(id) {
        let idx = this.findIndexOfId(id)
        if (idx == -1)
            return null
        return this.itemList[idx];
    }

    deleteItem(id) {
        let idx = this.findIndexOfId(id)
        this.itemList.splice(idx, 1);
        this.applyFilters();
        window.dispatchEvent(this.itemsChangeEvent);
        window.dispatchEvent(this.filteredItemsChangeEvent);
    }

    saveItem(drink) {
        let idx = -1;
        if (drink.id !== undefined) {
            idx = this.findIndexOfId(drink.id);
        }
        if (idx == -1) { // new
            // console.log("saveItem: saved as new", drink);
            drink.id = this.newId;
            this.itemList.push(drink);

        } else { // existing
            // console.log("saveItem: saved as existing", drink);
            this.itemList[idx] = drink;
        }
        this.applyFilters();
        window.dispatchEvent(this.itemsChangeEvent);
    }

    get newId() {
        this._newId++;
        return this._newId;
    }

}

export default Drinks;
