
export class ItemsGallery {

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
        for (let item of this.drinkList.filteredItemList) {
            // if (!--max) break;
            html += `<div class="card" data-id="${item.id}"><div class="card-header">${item.name}</div>` +
                `  <div class="card-body"><p class="card-text"> <img src="${item.image}" alt="${item.name}"/> </p></div>` +
                '  <div class="card-footer">' +
                '    <div class="row">' +
                // '    <div class="col-6"><span class="align-middle">Ár: 6990 Ft</span></div>' +
                '    <div class="col-6 text-end"><a href="#"class="btn btn-sm btn-success">Order it</a></div>' +
                '  </div>' +
                '</div>' +
                '</div>';
        }
        console.log("renderItems", html);

        let isDown = false;
        let startX;
        let scrollLeft;

        $(this.container).html(html);

        $(this.container).off("mousedown").on('mousedown', (e) => {
            let container = $(this.container)[0]
            isDown = true;
            $(this.container).addClass('active');
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        $(this.container).off("mouseleave").on('mouseleave', () => {
            isDown = false;
            $(this.container).removeClass('active');
        });

        $(this.container).off("mouseup").on('mouseup', () => {
            isDown = false;
            $(this.container).removeClass('active');
        });

        $(this.container).off("mousemove").on('mousemove', (e) => {
            if (isDown) {
                let container = $(this.container)[0]
                let x = e.pageX - container.offsetLeft;
                let walk = (x - startX) * 3;
                container.scrollLeft = scrollLeft - walk;
                e.preventDefault();
            }
        });
    }

    // scroll into view:
    //$("#gallery-container")[0].scrollLeft = $('div.card[data-id="100"]')[0].offsetLeft
}

ItemsGallery._instance = null;
