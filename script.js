/* eslint-disable no-param-reassign */
const CARD_TEMPLATE = document.querySelector("#card-template");
const CARDS_CONTAINER = document.querySelector(".cards-container");

let library = [];

function Book(name, author, length, read = false) {
    // Constructor
    this.name = name;
    this.author = author;
    this.length = length;
    this.read = read;
}

// eslint-disable-next-line no-unused-vars
function addBookToLibrary(book) {
    library.push(book);
}

function setCardDetails(card, book) {
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

function displayBooks() {
    library.forEach((book, index) => {
        const card = CARD_TEMPLATE.cloneNode(true);
        card.setAttribute("data-card-index", index);
        card.removeAttribute("id");
        CARDS_CONTAINER.appendChild(card);

        setCardDetails(card, book);
    });
}

const testLibrary = [
    new Book("Harry Potter and the Philosopher's Stone", "J.K. Rowling", "223", true),
    new Book("War and Peace", "Leo Tolstoy", "1,225", true),
    new Book("All Quiet on the Western Front", "Erich Maria Remarque", "200"),
    new Book("The Count of Monte Cristo", "Alexandre Dumas and Auguste Maquet", "1,276"),
];

library = testLibrary;

displayBooks();
