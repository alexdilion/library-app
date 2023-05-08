const MAIN_SECTION = document.querySelector("main");
const CARDS_CONTAINER = document.querySelector(".cards-container");
const CARD_TEMPLATE = document.querySelector("#card-template");

const MODAL_WRAPPER = document.querySelector(".modal-wrapper");
const OPEN_FORM_BUTTON = document.querySelector("#button-open-form");
const CLOSE_FORM_BUTTON = document.querySelector("#button-close-form");
const NEW_BOOK_FORM = document.querySelector(".form-new-book");
const REQUIRED_INPUTS = document.querySelectorAll(".required-input");
const FORM_INPUTS = Array.from(NEW_BOOK_FORM.querySelectorAll("input"));

let library = [];
let formVisible = false;
let editingBook = false;
let currentIndex = 0;

// Book constructor
function Book(name, author, length, read = false) {
    this.name = name;
    this.author = author;
    this.length = length;
    this.read = read;
}

// Add book to library
function addBookToLibrary(book) {
    library.push(book);
}

// Set the details of a book's card
function setCardDetails(book, bookIndex) {
    const card = CARDS_CONTAINER.querySelector(`[data-card-index="${bookIndex}"]`);
    card.querySelector(".book-name").textContent = book.name;
    card.querySelector(".book-author").textContent = `By ${book.author}`;
    card.querySelector(".book-length").textContent = `Book length: ${book.length} pages`;

    const statusText = card.querySelector(".status-text");

    if (book.read) {
        statusText.textContent = "Read";
        statusText.classList.add("read");
        statusText.classList.remove("unread");
    } else {
        statusText.textContent = "Unread";
        statusText.classList.add("unread");
        statusText.classList.remove("read");
    }
}

// Display all the books in the library array
function displayBooks() {
    CARDS_CONTAINER.innerHTML = "";

    library.forEach((book, index) => {
        const card = CARD_TEMPLATE.cloneNode(true);
        card.setAttribute("data-card-index", index);
        card.removeAttribute("id");
        CARDS_CONTAINER.appendChild(card);

        setCardDetails(book, index);
    });
}

function getFormData() {
    const inputs = FORM_INPUTS.reduce((acc, input) => {
        const {name} = input;
        let {value} = input;

        if (input.type === "checkbox") {
            value = input.checked;
        }

        return {...acc, [name]: value};
    }, {});

    return inputs;
}

// Show or hide modal form
function toggleForm() {
    if (!formVisible) {
        MODAL_WRAPPER.classList.remove("display-none");
        MODAL_WRAPPER.querySelector("#text-book-name").focus();
        MAIN_SECTION.classList.add("blur");
    } else {
        MODAL_WRAPPER.classList.add("display-none");
        MAIN_SECTION.classList.remove("blur");
    }

    if (editingBook) {
        MODAL_WRAPPER.querySelector(".form-header").textContent = "Edit Book";
        MODAL_WRAPPER.querySelector("#form-submit-button").textContent = "Edit Book";
    } else {
        MODAL_WRAPPER.querySelector(".form-header").textContent = "Add a New Book";
        MODAL_WRAPPER.querySelector("#form-submit-button").textContent = "Add Book";

        const inputs = NEW_BOOK_FORM.querySelectorAll("input");

        inputs.forEach((input) => {
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
    addBookToLibrary(newBook);
    toggleForm();
    displayBooks();
}

// Remove the book at the given index from the library
function removeBookFromLibrary(bookIndex) {
    library.splice(bookIndex, 1);
    displayBooks();
}

// Edit the book at the given library index
function editBookFromLibrary(bookIndex) {
    const inputs = getFormData();
    const book = library[bookIndex];

    Object.keys(inputs).forEach((key) => {
        book[key] = inputs[key];
    });

    editingBook = false;
    toggleForm();
    displayBooks();
}

// Check if the user clicked outside the modal form
// If they did, close the form
function onModalClick(event) {
    const clickX = event.clientX;
    const clickY = event.clientY;

    const modal = MODAL_WRAPPER.children[0];
    const modalX = modal.getBoundingClientRect().x;
    const modalY = modal.getBoundingClientRect().y;

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
        removeBookFromLibrary(cardIndex);
    } else if (button.classList.contains("button-edit")) {
        editingBook = true;
        currentIndex = cardIndex;

        FORM_INPUTS.forEach((input) => {
            if (input.type === "checkbox") {
                input.checked = library[currentIndex][input.name];
            } else {
                input.value = library[currentIndex][input.name];
            }
        });

        toggleForm();
    }
}

// "Activate" input after they've been selected once
// This prevents errors from showing up before the user has interacted with the inputs
function activateInput(input) {
    if (!input.classList.contains("activated")) {
        input.classList.add("activated");
    }
}

const testLibrary = [
    new Book("Harry Potter and the Philosopher's Stone", "J.K. Rowling", "223", true),
    new Book("War and Peace", "Leo Tolstoy", "1225"),
    new Book("All Quiet on the Western Front", "Erich Maria Remarque", "200", true),
    new Book("The Count of Monte Cristo", "Alexandre Dumas and Auguste Maquet", "1276"),
];

library = testLibrary;

displayBooks();

// Events handled here

OPEN_FORM_BUTTON.addEventListener("click", toggleForm);
CLOSE_FORM_BUTTON.addEventListener("click", toggleForm);

NEW_BOOK_FORM.querySelector("#form-submit-button").addEventListener("click", () => {
    console.log(NEW_BOOK_FORM.checkValidity());
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
