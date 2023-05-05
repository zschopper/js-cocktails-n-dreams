"use strict";

import Drink from "./drink.js";

class EditUI {

    constructor() {
        if (EditUI._instance) {
            console.warn("Already created");
            return EditUI._instance;
        }
        EditUI._instance = this;
        this.container = "";
        this.drinkList = null;
    }

    static get instance() {
        if (!EditUI._instance) {
            return new EditUI();
        }
        return EditUI._instance;
    }

    setContainer(container) {
        this.container = container;
        $("#btn-apply").on("click", function (event) {
            let item = this.readItemFromControls();
            this.drinkList.saveItem(item);
            console.log("apply clicked", item, this);
        }.bind(this));

        $("#btn-save").on("click", function (event) {
            let item = this.readItemFromControls();
            $(this.container).modal("hide");
            this.drinkList.saveItem(item);
            console.log("save clicked", item, this);
        }.bind(this));

        $("#btn-prev").on("click", function (event) {
            let id = $("#form-field-id").val();
            let item = this.drinkList.findItemById(id);
            let idx = this.drinkList.filteredItemList.indexOf(item) - 1;
            if (idx == -1) {
                idx = this.drinkList.filteredItemList.length - 1;
            }
            let newItem = this.drinkList.filteredItemList[idx];
            this.writeItemToControls(newItem);
        }.bind(this));

        $("#btn-next").on("click", function (event) {
            let id = $("#form-field-id").val();
            let item = this.drinkList.findItemById(id);
            let idx = this.drinkList.filteredItemList.indexOf(item);
            idx = (++idx % this.drinkList.filteredItemList.length);
            let newItem = this.drinkList.filteredItemList[idx];
            this.writeItemToControls(newItem);
        }.bind(this));
        return this;
    }

    setList(drinkList) {
        this.drinkList = drinkList;
        return this;
    }

    writeItemToControls(item) {
        let form = $(this.container + " form");
        console.log("loadItemToControls", item);

        $("#form-field-id").val(item.id);
        $("#form-field-name").val(item.name);
        $(`#form-field-category option[value="${item.category}"]`).prop("selected", true);
        $(`#form-field-alcoholic option[value="${item.alcoholic}"]`).prop("selected", true);
        $("#form-field-price").val(item.price);
        $(`#form-field-glass option[value="${item.glass}"]`).prop("selected", true);
        $(`#form-field-iba option[value="${item.iba}"]`).prop("selected", true);
        $("#form-field-instructions").val(item.instructions);
        for (let i = 0; i < 12; i++) {
            if (i < item.ingredients.length) {
                $(`#form-field-ing-${i + 1}-name`).val(item.ingredients[i].ingredient);
                $(`#form-field-ing-${i + 1}-meas`).val(item.ingredients[i].measure);
            } else {
                console.log(i, "no")
                $(`#form-field-ing-${i + 1}-name`).val("");
                $(`#form-field-ing-${i + 1}-meas`).val("");
            }
        }
    }

    readItemFromControls() {
        let form = $(this.container + " form");

        let ingredients = [];
        for (let i = 0; i < 12; i++) {
            let ingredient = $(`#form-field-ing-${i + 1}-name`).val().trim();
            let measure = $(`#form-field-ing-${i + 1}-meas`).val().trim();
            if (ingredient) {
                ingredients.push({ ingredient: ingredient, measure: measure });
            }
        }

        let item = {
            id: $("#form-field-id").val(),
            name: $("#form-field-name").val(),
            category: $(`#form-field-category`).val(),
            alcoholic: $(`#form-field-alcoholic`).val(),
            price: $(`#form-field-price`).val(),
            glass: $(`#form-field-glass`).val(),
            iba: $(`#form-field-iba`).val(),
            instructions: $("#form-field-instructions").val(),
            ingredients: ingredients,
        }
        return new Drink(item);
    }

    viewItem(item) {
        // TODO: same as edit but controls are read-only
    }

    editItem(item) {
        $(this.container + " .modal-header h1").text("Edit Drink");
        console.log("editItem", item);

        this.writeItemToControls(item);
        // show prev/next
        // $(this.container + " .modal-header h1").text("Edit item");
        $(this.container).modal("show");
    }

    newItem(item) {
        $(this.container + " .modal-header h1").text("New Drink");
        // TODO: hide prev/next
        $(this.container).modal("show");
    }

}

EditUI._instance = null;

export default EditUI;
