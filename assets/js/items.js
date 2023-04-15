import { Drink } from "./drink.js";
export let itemList = [];
export let filteredItemList =  [];
export let fieldDefs = [
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

// create object from field def list (for quicker access of fields by their name)
export let fieldDefByName = {};

fieldDefs.map((v, k) => { fieldDefByName[v.name] = v });

export let fieldValues = {
    alcoholic: [],
    category: [],
    glass: [],
    iba: [],
    ingredient: [],
};

export function loadItems() {
    itemList = [];

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

                fieldValues["alcoholic"].push(values.alcoholic);
                fieldValues["category"].push(values.category);
                fieldValues["glass"].push(values.glass);
                fieldValues["iba"].push(values.iba);
                let i = 1;
                while (item.hasOwnProperty("strIngredient" + i) && item["strIngredient" + i]) {
                    values.ingredients.push({
                        "measure": item["strMeasure" + i],
                        "ingredient": item["strIngredient" + i],
                    });
                    fieldValues["ingredient"].push(item["strIngredient" + i]);
                    i += 1;
                }
                itemList.push(new Drink(values));

                // don't load all items - for testing
                // if (itemList.length == 200)
                //     break;
            }

            // make lists unique
            for (const key in fieldValues) {
                fieldValues[key] = [... new Set(fieldValues[key])].sort().filter(item => item);
                fieldValues[key].unshift("")
            }

            console.log(itemList, fieldValues);
        },
        fail: function () {
            console.log("Loading items: An error has occurred.");
        }
    });
}

export function sortItems(field, ascending = true) {
    console.log("sortItems", [field, ascending]);

    let fieldDef = fieldDefByName[field];

    console.log("sortItems:field", fieldDef);

    filteredItemList.sort((a, b) => {
        // console.log("sort", a, b, fieldDef);

        let dir = 1;
        if (!ascending) {
            dir = -1;
        }

        switch (fieldDef.displayAs) {
            case "text":
                console.log("cmp", a[field], b[field] );

                return a[field].toString().localeCompare(b[field]) * dir;
            case "number":
                return (a[field] - b[field]) * dir;
            default:
                return 1;
        }
    });
}

export function filterItems(filters) {
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

    filteredItemList = itemList.filter((item) => {

        for (let key in filterFields) {
            if (!filterFields[key].includes(item[key])){
                return false;}
        }
        return true;
    });
    return filteredItemList;
}
