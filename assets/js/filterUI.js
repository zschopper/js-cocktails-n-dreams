import { Drinks } from "./items.js";

export class FilterUI { // singleton class

    constructor() {
        if (FilterUI._instance) {
            console.warn("Already created");
            return FilterUI._instance;
        }
        FilterUI._instance = this;
        this.container = "";
    }

    static get instance() {
        if (!FilterUI._instance) {
            return new FilterUI();
        }
        return FilterUI._instance;
    }

    initFields(container) {

        this.container = container;

        for (let key in Drinks.fieldDefs) {
            let field = Drinks.fieldDefs[key];
            if (field.filter != "") {

                // console.log("FilterUI.initFields, FilterField: ", key, field);
                if (field.filter == "text") {
                    // console.log("FilterField: (text)", key, field)
                    $(this.container).append(`<input type="text" name="${field.name}" data-field-name="${field.name}" data-field-display-name="${field.title}" class="filter-field" id="filter-${field.name}" placeholder="${field.title}" />`);
                } else if (field.filter == "list") {
                    // console.log("FilterField: (list)", key, field)
                    let options = "";
                    // console.log("xx", Drinks.fieldValues, field.name);

                    let currentFieldValues = Drinks.fieldValues[field.name]
                    for (let key in currentFieldValues) {
                        let optionText = currentFieldValues[key];
                        if (optionText == "") {
                            optionText = "&lt;" + field.title + "&gt;";
                        }
                        options += `<option value="${currentFieldValues[key]}">${optionText}</option>`;
                    }
                    $(this.container).append(`<select name="${field.name}" data-field-name="${field.name}" data-field-display-name="${field.title}" class="filter-field" id="filter-${field.name}" placeholder="${field.title}">${options}</select>`);
                }
            }
        }
        $(this.container + " .filter-field").on("change", event => { this.filterFieldChange(event); });
    }

    filterFieldChange(event) {
        let target = $(event.target);
        let value = target.val();
        let text = target.text();
        let fieldName = target.data("fieldName")
        let fieldDisplayName = target.data("fieldDisplayName")

        if (target.is("select")) {
            let selected = target.children("option:selected");
            text = selected.text();
            selected.prop("disabled", "true"); // disable selected item to avoid be selected again
        } else if (target.is("input:text")) {
            text = target.val();
            target.val("") // cleanup input after using its value
        }

        // console.log("filterFieldChange", target, value, text, fieldName, fieldDisplayName);
        $(this.container).append(`<div class="filter-badge" data-field-name="${fieldName}" data-value="${value}">${fieldDisplayName}: ${text}<button type="button" class="btn btn-sm btn-close" aria-label="Close"></button></div>`)
        console.log($(this.container).children(".filter-badge button"))
        $(this.container + " .filter-badge button").off().on("click", event => this.removeFilterClick(event))
    }

    removeFilterClick(event) {

        console.log("removeFilterClick")
        // TODO: re-enable selected but disabled item.
        $(event.target).parent(".filter-badge").remove()
    }
}

FilterUI._instance = null;
