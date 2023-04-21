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
            { name: "instructions", title: "Instructions", displayAs: "text", displayOn: ["card"], sortable: false, filter: "text", },
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
                console.log("loadItems this", this)
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

            }.bind(this),
            fail: function () {
                console.log("Loading items: An error has occurred.");
            }
        });
    }

    sortItems(field, ascending = true) {
        console.log("sortItems", [field, ascending]);

        let fieldDef = this.fieldDefByName[field];

        console.log("sortItems:field", fieldDef);

        this.filteredItemList.sort((a, b) => {
            // console.log("sort", a, b, fieldDef);

            let dir = 1;
            if (!ascending) {
                dir = -1;
            }

            switch (fieldDef.displayAs) {
                case "text":
                    // console.log("cmp", a[field], b[field]);

                    return a[field].toString().localeCompare(b[field]) * dir;
                case "number":
                    return (a[field] - b[field]) * dir;
                default:
                    return 1;
            }
        });
    }

    addFilter(field, value, suppress=false) {
        if (this.findFilter(field, value) == -1) {
            this.filters.push({ field: field, value: value });

            if (!suppress) {
                this.applyFilters()
            }
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
        console.log("applyFilters", this.filters );

        let filterFields = {};

        for (let filter of this.filters) {
            console.log("applyFilters: key/value", filter.field, filter.value);

            if (filterFields[filter.field] == undefined) {
                filterFields[filter.field] = [filter.value];
            } else {
                filterFields[filter.field].push(filter.value);
            }
        }

        this.filteredItemList = this.itemList.filter((item) => {

            for (let key in filterFields) {
                if (!filterFields[key].includes(item[key])) {
                    return false;
                }
            }
            return true;
        });
        return this.filteredItemList;

    }
    findIndexOfId(id) {
        let i = 0
        while(i < this.itemList.length && this.itemList[i].id != id) {
            i++;
        }

        if (i < this.itemList.length) {
            return i;
        }
        return -1;
    }

    deleteItem(id) {
        let idx = this.findIndexOfId(id)
        this.itemList.splice(idx, 1);
        this.applyFilters();
        // dispach a redraw ewent
    }


}
