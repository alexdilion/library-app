/* eslint-disable max-classes-per-file */
const MAIN_SECTION = document.querySelector("main");
const CARDS_CONTAINER = document.querySelector(".cards-container");
const CARD_TEMPLATE = document.querySelector("#card-template");

const MODAL_WRAPPER = document.querySelector(".modal-wrapper");
const OPEN_FORM_BUTTON = document.querySelector("#button-open-form");
const CLOSE_FORM_BUTTON = document.querySelector("#button-close-form");
const NEW_BOOK_FORM = document.querySelector(".form-new-book");
const REQUIRED_INPUTS = document.querySelectorAll(".required-input");
const FORM_INPUTS = Array.from(NEW_BOOK_FORM.querySelectorAll("input"));

let formVisible = false;
let editingBook = false;
let currentIndex = 0;

class Library {
    constructor(books = []) {
        this.books = books;
    }

    addBook(book) {
        this.books.push(book);
    }

    removeBook(index) {
        this.books.splice(index, 1);
    }

    displayBooks() {
        CARDS_CONTAINER.innerHTML = "";

        this.books.forEach((book, index) => {
            const card = CARD_TEMPLATE.cloneNode(true);
            card.setAttribute("data-card-index", index);
            card.removeAttribute("id");
            CARDS_CONTAINER.appendChild(card);

            book.updateCard(index);
        });
    }

    getBookByIndex(index) {
        return this.books[index];
    }
}

class Book {
    constructor(name, author, length, read = false) {
        this.name = name;
        this.author = author;
        this.length = length;
        this.read = read;
    }

    updateCard(index) {
        const card = CARDS_CONTAINER.querySelector(`[data-card-index="${index}"]`);
        card.querySelector(".book-name").textContent = this.name;
        card.querySelector(".book-author").textContent = `By ${this.author}`;
        card.querySelector(".book-length").textContent = `Book length: ${this.length} pages`;

        const statusText = card.querySelector(".status-text");

        if (this.read) {
            statusText.textContent = "Read";
            statusText.classList.add("read");
            statusText.classList.remove("unread");
        } else {
            statusText.textContent = "Unread";
            statusText.classList.add("unread");
            statusText.classList.remove("read");
        }
    }

    editBookDetails(inputs) {
        Object.keys(inputs).forEach((key) => {
            this[key] = inputs[key];
        });
    }
}

const defaultBooks = [
    new Book("Harry Potter and the Philosopher's Stone", "J.K. Rowling", "223", true),
    new Book("War and Peace", "Leo Tolstoy", "1225"),
    new Book("All Quiet on the Western Front", "Erich Maria Remarque", "200", true),
    new Book("The Count of Monte Cristo", "Alexandre Dumas and Auguste Maquet", "1276"),
];

const library = new Library(defaultBooks);

function getFormData() {
    const inputs = FORM_INPUTS.reduce((acc, input) => {
        const { name } = input;
        let { value } = input;

        if (input.type === "checkbox") {
            value = input.checked;
        }

        return { ...acc, [name]: value };
    }, {});

    return inputs;
}

// Show or hide modal form
function toggleForm() {
    if (!formVisible) {
        MODAL_WRAPPER.classList.remove("display-none");
        MODAL_WRAPPER.querySelector("#text-book-name").focus();
        MODAL_WRAPPER.setAttribute("aria-hidden", false);
        MAIN_SECTION.classList.add("blur");
    } else {
        MODAL_WRAPPER.classList.add("display-none");
        MODAL_WRAPPER.setAttribute("aria-hidden", true);
        MAIN_SECTION.classList.remove("blur");
    }

    if (editingBook) {
        MODAL_WRAPPER.querySelector(".form-header").textContent = "Edit Book";
        MODAL_WRAPPER.querySelector("#form-submit-button").textContent = "Edit Book";
    } else {
        MODAL_WRAPPER.querySelector(".form-header").textContent = "Add a New Book";
        MODAL_WRAPPER.querySelector("#form-submit-button").textContent = "Add Book";

        const inputs = NEW_BOOK_FORM.querySelectorAll("input");

        inputs.forEach((v) => {
            const input = v;
            if (input.type === "checkbox") {
                input.checked = false;
            } else {
                input.value = "";
            }

            input.classList.remove("activated");
        });
    }

    formVisible = !formVisible;
}

// Get form data and make a book object with that data
function makeBookFromForm() {
    const inputs = getFormData();
    const newBook = new Book(inputs.name, inputs.author, inputs.length, inputs.read);

    library.addBook(newBook);
    toggleForm();
    library.displayBooks();
}

// Edit the book at the given library index
function editBookFromLibrary(bookIndex) {
    const inputs = getFormData();
    const book = library.getBookByIndex(bookIndex);

    book.editBookDetails(inputs);

    editingBook = false;
    toggleForm();
    library.displayBooks();
}

// Check if the user clicked outside the modal form
// If they did, close the form
function onModalClick(event) {
    const clickX = event.clientX;
    const clickY = event.clientY;

    const modal = MODAL_WRAPPER.children[0];
    const modalX = modal.getBoundingClientRect().x;
    const modalY = modal.getBoundingClientRect().y;

    // Check if user has clicked outside of the form to close
    if (
        clickX < modalX ||
        clickY < modalY ||
        clickX > modalX + modal.offsetWidth ||
        clickY > modalY + modal.offsetHeight
    ) {
        toggleForm();
        editingBook = false;
    }
}

// Handle card button clicks
function onCardButtonClicked(button) {
    const card = button.closest(".card");
    const cardIndex = card.getAttribute("data-card-index");

    if (button.classList.contains("button-delete")) {
        library.removeBook(cardIndex);
        library.displayBooks();
    }

    if (button.classList.contains("button-edit")) {
        editingBook = true;
        currentIndex = cardIndex;

        FORM_INPUTS.forEach((v) => {
            const input = v;
            if (input.type === "checkbox") {
                input.checked = library.getBookByIndex(currentIndex)[input.name];
            } else {
                input.value = library.getBookByIndex(currentIndex)[input.name];
            }
        });

        toggleForm();
    }
}

// Activate input after they've been selected once
// This prevents errors from showing up before the user has interacted with the inputs
function activateInput(input) {
    if (!input.classList.contains("activated")) {
        input.classList.add("activated");
    }
}

function checkInputValidity(input) {
    if (input.checkValidity()) return;

    const errorElement = document.querySelector(`#${input.id} + .error-message`);
    const labelText = input.parentNode.querySelector("label").innerText.slice(0, -2);

    console.log(labelText);

    switch (true) {
        case input.validity.valueMissing:
            errorElement.innerHTML = `<span class="material-symbols-outlined" aria-label="Attention!" aria-hidden="true">error</span>Please enter a value for the ${labelText.toLowerCase()}`;
            break;
        case input.validity.rangeUnderflow:
            errorElement.innerHTML = `<span class="material-symbols-outlined" aria-label="Attention!" aria-hidden="true">error</span>Please enter a positive value for the ${labelText.toLowerCase()}`;
            break;
        default:
            errorElement.innerHTML = `<span class="material-symbols-outlined" aria-label="Attention!" aria-hidden="true">error</span>Please enter a valid value for the ${labelText.toLowerCase()}`;
            break;
    }
}

library.displayBooks();

// Events handled here

OPEN_FORM_BUTTON.addEventListener("click", () => {
    editingBook = false;
    toggleForm();
});

CLOSE_FORM_BUTTON.addEventListener("click", () => {
    editingBook = false;
    toggleForm();
});

NEW_BOOK_FORM.querySelector("#form-submit-button").addEventListener("click", () => {
    if (!NEW_BOOK_FORM.checkValidity()) {
        REQUIRED_INPUTS.forEach((input) => activateInput(input));
    }
});

CARDS_CONTAINER.addEventListener("click", (event) => {
    if (event.target.classList.contains("card-button")) {
        onCardButtonClicked(event.target);
    }
});

REQUIRED_INPUTS.forEach((input) => {
    input.addEventListener("focusout", (event) => activateInput(event.target));
    input.addEventListener("change", () => {
        checkInputValidity(input);
    });
});

document.addEventListener("mousedown", (event) => {
    if (formVisible && event.target !== OPEN_FORM_BUTTON) {
        onModalClick(event);
    }
});

NEW_BOOK_FORM.addEventListener("submit", (event) => {
    event.preventDefault();

    if (editingBook) {
        editBookFromLibrary(currentIndex);
    } else {
        makeBookFromForm();
    }
});
