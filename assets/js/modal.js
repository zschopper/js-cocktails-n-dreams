export function openModal(item, fieldData, parentElement) {

    let modal;
    modal = document.getElementById("edit-modal");

    if (modal) {

    } else {

        modal = parentElement.appendChild(document.createElement("div"));
        modal.classList.add("modal");
        modal.id = "edit-modal";
        let modalDialog = modal.appendChild(document.createElement("div"));
        modalDialog.classList.add("modal-dialog");
        let modalContent = modalDialog.appendChild(document.createElement("div"));
        modalContent.classList.add("modal-content");
        let modalHeader = modalContent.appendChild(document.createElement("div"));
        modalHeader.classList.add("modal-header");
        let modalTitle = modalHeader.appendChild(document.createElement("h5"));
        modalTitle.classList.add("modal-title");
        modalTitle.innerHTML = 'Szerkesztés'

        let btnClose = modalHeader.appendChild(document.createElement("button"));
        console.log(btnClose);
        btnClose.type = "button";
        btnClose.classList.add("btn-close");
        btnClose.setAttribute("data-bs-dismiss", "modal");
        btnClose.setAttribute("aria-label", "Close");

        let modalBody = modalContent.appendChild(document.createElement("div"));
        modalBody.classList.add("modal-body");

        let szoveg = "";
        for (let idx in fieldData) {
            let fieldSet = modalBody.appendChild(document.createElement("fieldset"));
            let field = fieldData[idx];
            console.log(idx, field);
            let label = fieldSet.appendChild(document.createElement("label"));
            label.setAttribute("for", field.name);
            label.setAttribute("for", `edit-modal-${field.name}`);
            label.classList.add("col-form-label");
            label.innerText = field.title;
            let input =  fieldSet.appendChild(document.createElement("input"));
            input.name = field.name;
            input.id = `edit-modal-${field.name}`;
            input.classList.add("form-control");
            input.type = field.inputtype;
            if (field.required) {
                input.required = true;
            }
            switch (field.inputtype) {
                case "button": break;
                case "checkbox": break;
                case "color": break;
                case "date": break;
                case "datetime-local": break;
                case "email": break;
                case "file": break;
                case "hidden": break;
                case "image": break;
                case "month": break;
                case "number": break;
                case "password": break;
                case "radio":
                break;
                case "range": break;
                case "reset": break;
                case "search": break;
                case "submit": break;
                case "tel": break;
                case "text": break;
                case "time": break;
                case "url": break;
                case "week": break;
            }
            /*






















 */
            // szoveg +=
            //     field.name + " "
            // field.inputtype + " "
            // field.validation + " "
            // // field.minimumvalue + " "
            // // field.maximumvalue + " "
            // field.required + " "
            // field.length;
        }

        let modalBodyText = modalBody.appendChild(document.createElement("p"));
        modalBodyText.innerText = szoveg;

        let modalFooter = modalContent.appendChild(document.createElement("div"));
        modalFooter.classList.add("modal-footer");

        let btnSecondary = modalFooter.appendChild(document.createElement("button"));
        btnSecondary.classList.add("btn", "btn-secondary");
        btnSecondary.setAttribute("data-bs-dismiss", "modal");
        btnSecondary.innerText = "Close";

        let btnPrimary = modalFooter.appendChild(document.createElement("button"));
        btnPrimary.classList.add("btn", "btn-primary");
        btnPrimary.innerText = "SaveChanges";
    }


    const myModal = new bootstrap.Modal(modal, {});
    // myModal.addEventListener('shown.bs.modal', () => {
    //     myInput.focus();
    // })
    myModal.show();


    // let modal = parentElement.
    /*
const myModal = document.getElementById('myModal');
const myInput = document.getElementById('myInput');

    */

}

/*
<div class="modal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Modal title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Modal body text goes here.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>



<div class="modal show" id="edit-modal" aria-modal="true" role="dialog" style="display: block;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header"></div>
            <h5 class="modal-title">Modal Title</h5><button type="button" class="btn-close" data-bs-dismiss="modal"
                aria-label="Close"></button>
            <div class="modal-body">
                <p>blahblah</p>
            </div>
            <div class="modal-footer"><button class="btn btn-secondary" data-bs-dismiss="modal">Close</button><button
                    class="btn btn-primary">SaveChanges</button></div>
        </div>
    </div>
</div>

 */