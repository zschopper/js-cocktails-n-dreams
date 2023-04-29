"use strict";

export class FilterUI { // singleton class

    constructor() {
        if (FilterUI._instance) {
            console.warn("Already created");
            return FilterUI._instance;
        }
        FilterUI._instance = this;
        this.container = "";
        this.badgeContainer = "";
        this.drinkList = null;
    }

    static get instance() {
        if (!FilterUI._instance) {
            return new FilterUI();
        }
        return FilterUI._instance;
    }

    setList(drinkList) {
        this.drinkList = drinkList;
        return this;
    }

    setContainer(container) {
        this.container = container;
        $(this.container + " .filter-field").on("change", event => { this.filterFieldChange(event); });
        return this;
    }

    setBadgeContainer(container) {
        this.badgeContainer = container;
        return this;
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
            selected.prop("selected", false)
            selected.prop("disabled", true); // disable selected item to avoid be selected again
        } else if (target.is("input:text")) {
            text = target.val();
            target.val("") // cleanup input after using its value
        }

        $(this.badgeContainer).append(`<div class="btn btn-secondary filter-badge" data-field-name="${fieldName}" data-value="${value}">${fieldDisplayName}: ${text} <button type="button" class="btn btn-sm btn-close" aria-label="Close"></button> </div>`)
        // console.log($(this.container).children(".filter-badge button"))
        $(this.badgeContainer + " .filter-badge button").off().on("click", event => this.removeFilterClick(event))
        this.drinkList.addFilter(fieldName, value);
    }

    removeFilterClick(event) {
        // find field name & value
        let dataParent = $(event.target).closest("[data-field-name]");
        let fieldName = dataParent.attr("data-field-name");
        let value = dataParent.attr("data-value");

        // remove filter from Drinks filter list
        this.drinkList.removeFilter(fieldName, value);

        // re-enable select option
        let select = $(`select[data-field-name=${fieldName}] option[value="${value}"]`).prop("disabled", false);

        // remove badge
        $(event.target).parent(".filter-badge").remove();
    }
}

FilterUI._instance = null;
