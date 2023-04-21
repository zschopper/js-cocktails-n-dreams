"use strict";

import { Drink } from "./drink.js";

export class Drinks {

    static itemList = [];
    static filteredItemList = [];
    static fieldDefs = [
        {
            name: "id",
            title: "#",
            displayAs: "number",
            displayOn: ["card", "table"],
            sortable: true,
            filter: "number",
        },
        {
            name: "name",
            title: "Name",
            displayAs: "text",
            displayOn: ["card", "table"],
            sortable: true,
            filter: "text",
        },
        {
            name: "category",
            title: "Category",
            displayAs: "text",
            displayOn: ["card", "table"],
            sortable: true,
            filter: "list",
        },
        {
            name: "alcoholic",
            title: "Alcoholic",
            displayAs: "text",
            displayOn: ["card", "table"],
            sortable: true,
            filter: "list",
        },
        {
            name: "image",
            title: "Image",
            displayAs: "image",
            displayOn: ["card"],
            sortable: false,
            filter: "",
        },
        {
            name: "glass",
            title: "Glass",
            displayAs: "text",
            displayOn: ["card", "table"],
            sortable: true,
            filter: "list",
        },
        {
            name: "iba",
            title: "IBA",
            displayAs: "text",
            displayOn: ["card", "table"],
            sortable: true,
            filter: "list",
        },
        {
            name: "instructions",
            title: "Instructions",
            displayAs: "text",
            displayOn: ["card"],
            sortable: false,
            filter: "text",
        },
        {
            name: "noOfIngredients",
            title: "No. of Ingr.",
            displayAs: "number",
            displayOn: ["table"],
            sortable: true,
            filter: "",
        },
    ];

    static fieldValues = {
        alcoholic: [],
        category: [],
        glass: [],
        iba: [],
        ingredient: [],
    };

    // create object from field def list (for quicker access of fields by their name)
    static fieldDefByName = {};

    static init() {
        Drinks.fieldDefs = [
            {
                name: "id",
                title: "#",
                displayAs: "number",
                displayOn: ["card", "table"],
                sortable: true,
                filter: "number",
            },
            {
                name: "name",
                title: "Name",
                displayAs: "text",
                displayOn: ["card", "table"],
                sortable: true,
                filter: "text",
            },
            {
                name: "category",
                title: "Category",
                displayAs: "text",
                displayOn: ["card", "table"],
                sortable: true,
                filter: "list",
            },
            {
                name: "alcoholic",
                title: "Alcoholic",
                displayAs: "text",
                displayOn: ["card", "table"],
                sortable: true,
                filter: "list",
            },
            {
                name: "image",
                title: "Image",
                displayAs: "image",
                displayOn: ["card"],
                sortable: false,
                filter: "",
            },
            {
                name: "glass",
                title: "Glass",
                displayAs: "text",
                displayOn: ["card", "table"],
                sortable: true,
                filter: "list",
            },
            {
                name: "iba",
                title: "IBA",
                displayAs: "text",
                displayOn: ["card", "table"],
                sortable: true,
                filter: "list",
            },
            {
                name: "instructions",
                title: "Instructions",
                displayAs: "text",
                displayOn: ["card"],
                sortable: false,
                filter: "text",
            },
            {
                name: "noOfIngredients",
                title: "No. of Ingr.",
                displayAs: "number",
                displayOn: ["table"],
                sortable: true,
                filter: "",
            },
        ];

        Drinks.fieldDefs.map((v, k) => { Drinks.fieldDefByName[v.name] = v });
    }

    static loadItems() {
        Drinks.itemList = [];

        $.ajax({
            url: 'assets/data/all_drinks.json',
            async: false,
            dataType: 'json',
            success: function (data) {
                console.log("loadItems", "load OK");

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

                    Drinks.fieldValues["alcoholic"].push(values.alcoholic);
                    Drinks.fieldValues["category"].push(values.category);
                    Drinks.fieldValues["glass"].push(values.glass);
                    Drinks.fieldValues["iba"].push(values.iba);
                    let i = 1;
                    while (item.hasOwnProperty("strIngredient" + i) && item["strIngredient" + i]) {
                        values.ingredients.push({
                            "measure": item["strMeasure" + i],
                            "ingredient": item["strIngredient" + i],
                        });
                        Drinks.fieldValues["ingredient"].push(item["strIngredient" + i]);
                        i += 1;
                    }
                    Drinks.itemList.push(new Drink(values));

                    // limit number of items - for testing
                    // if (Drinks.itemList.length == 200)
                    //     break;
                }

                // make filter lists unique
                for (const key in Drinks.fieldValues) {
                    Drinks.fieldValues[key] = [... new Set(Drinks.fieldValues[key])].sort().filter(item => item);
                    Drinks.fieldValues[key].unshift("")
                }

            },
            fail: function () {
                console.log("Loading items: An error has occurred.");
            }
        });
    }

    static sortItems(field, ascending = true) {
        console.log("sortItems", [field, ascending]);

        let fieldDef = Drinks.fieldDefByName[field];

        console.log("sortItems:field", fieldDef);

        Drinks.filteredItemList.sort((a, b) => {
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

    static filterItems(filters) {
        // console.log("filterItems: filters", filters);
        if (!filters) {
            return itemList;
        }
        let filterFields = {};

        for (let filter of filters) {
            let keyAndName = filter.split(":").map(element => element.trim());
            if (keyAndName.length == 2) {

                let [key, value] = keyAndName;
                // console.log("filterItems: key/value", key, value);

                if (filterFields[key] == undefined) {
                    filterFields[key] = [value];
                } else {
                    filterFields[key].push(value);
                }
            }
        }

        Drinks.filteredItemList = Drinks.itemList.filter((item) => {

            for (let key in filterFields) {
                if (!filterFields[key].includes(item[key])) {
                    return false;
                }
            }
            return true;
        });
        return Drinks.filteredItemList;
    }

}

Drinks.init();