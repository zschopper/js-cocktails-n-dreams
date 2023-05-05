"use strict";

import Basket from "./basket.js";
class ItemsGallery {

    constructor() {
        if (ItemsGallery._instance) {
            console.warn("Already created");
            return ItemsGallery._instance;
        }
        ItemsGallery._instance = this;
        this.drinkList = null;
        this.container = "";
    }

    static get instance() {
        if (!ItemsGallery._instance) {
            return new ItemsGallery();
        }
        return ItemsGallery._instance;
    }

    setContainer(container) {
        this.container = container;
        return this;
    }

    setList(drinkList) {
        this.drinkList = drinkList;
        this.drinkList.on("itemsChange", (event) => { this.itemsChangeCallback() });
        this.drinkList.on("itemsOrderChange", (event) => { this.itemsOrderChangeCallback() });
        return this;
    }

    itemsChangeCallback() {
        console.log("ItemsTable::itemsChangeCallback");
        ItemsGallery.instance.renderItems();
    }

    itemsOrderChangeCallback() {
        console.log("ItemsTable::itemsOrderChangeCallback");
        ItemsGallery.instance.renderItems();
    }

    renderItems() {
        let html = '';
        let max = 20;
        if (!this.drinkList.filteredItemList.length) {
            $(this.container).html('<div class="gallery-is-empty">No item in the list.</div>');

        } else {
            for (let item of this.drinkList.filteredItemList) {
                let ingredients = '<ul>' + item.ingredients.map(e => `<li>${e.ingredient}</li>`).join("") + '</ul>';
                // if (!--max) break;
                html +=
                    '<div class="card-wrapper">' +
                    `  <div class="card" data-id="${item.id}">` +
                    '    <div class="card-face card-face-front">' +
                    `      <div class="card-header">${item.name}</div>` +
                    `      <div class="card-body"><p class="card-text"> <img src="${item.image}" alt="${item.name}" loading="lazy"/> </p></div>` +
                    '      <div class="card-footer">' +
                    '        <div class="row">' +
                    '          <div class="col-6 text-end"><a href="#" class="btn btn-sm btn-success flip"> Flip it!</a> or <a href="#" class="btn btn-sm btn-success order">Order it!</a></div>' +
                    '        </div>' +
                    '      </div>' +
                    '    </div>' +
                    '    <div class="card-face card-face-back">' +
                    `      <div class="card-header">${item.name}</div>` +
                    `      <div class="card-body"><p class="card-text"> Ingredients </p>${ingredients}</div>` +
                    '      <div class="card-footer">' +
                    '        <div class="row">' +
                    '          <div class="col-6 text-end"><a href="#" class="btn btn-sm btn-success flip">Flip back and order it!</a></div>' +
                    '        </div>' +
                    '      </div>' +
                    '    </div>' +
                    '  </div>' +
                    '</div>';
            }

            $(this.container).html(html);

            let isDown = false;
            let startX;
            let scrollLeft;
            let container = $(this.container)[0];

            function scrollStart(e) {
                isDown = true;

                const touches = e.changedTouches;
                let pageX = 0;
                if (touches && touches.length == 1) {
                    pageX = touches[0].pageX;
                } else {
                    pageX = e.pageX;
                }

                $(container).addClass('active');
                startX = pageX - container.offsetLeft;
                scrollLeft = container.scrollLeft;
            }

            function scroll(e) {
                if (isDown) {

                    const touches = e.changedTouches;
                    let pageX = 0;
                    if (touches && touches.length == 1) {
                        pageX = touches[0].pageX;
                    } else {
                        pageX = e.pageX;
                    }


                    let x = pageX - container.offsetLeft;
                    let walk = (x - startX) * 3;
                    container.scrollLeft = scrollLeft - walk;
                    e.preventDefault();
                }
            }

            function scrollEnd(e) {
                isDown = false;
                $(container).removeClass('active');
            }

            $(this.container).on('mousedown touchstart', scrollStart);
            $(this.container).on('touchmove mousemove', scroll);
            $(this.container).on('mouseleave mouseup touchend', scrollEnd);

            $(this.container + " .order").on('click', (e) => {
                let id = $(e.target).closest("[data-id]").data("id");
                let item = this.drinkList.findItemById(id);
                if (item) {
                    Basket.instance.addItem(item, 1);
                }
            });

            $(this.container + " .card .flip").on('click', (e) => {
                let card = $(e.target).closest(".card");
                card.toggleClass("is-flipped");
            });
        }

    }

    // scroll a card into view:
    //$("#gallery-container")[0].scrollLeft = $('div.card[data-id="100"]')[0].offsetLeft
}

ItemsGallery._instance = null;

export default ItemsGallery;
