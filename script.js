const CARD_TEMPLATE = document.querySelector("#card-template");
const CARD_CONTAINER = document.querySelector("#card-container");

let library = [];

function Book(name, author, length, read = false) {
    // Constructor
    this.name = name;
    this.author = author;
    this.length = length;
    this.read = read;
}

function addBookToLibrary(book) {
    library.push(book);
}

function setCardDetails(card, book) {
    card.querySelector(".book-name").textContent = book.name;
    card.querySelector(".book-author").textContent = `By ${book.author}`;
    card.querySelector(".book-length").textContent = `Book length: ${book.length} pages`;

	let statusText = card.querySelector(".status-text");

    if (book.read) {
        statusText.textContent = "Read";
        statusText.classList.add("read");
		statusText.classList.remove("unread")
    } else {
		statusText.textContent = "Unread";
		statusText.classList.add("unread");
		statusText.classList.remove("read");
	}
}

function displayBooks() {
	console.log(library);
    library.forEach(book => {
		let card = CARD_TEMPLATE.cloneNode(true);
        card.removeAttribute("id");
        card.removeAttribute("aria-hidden");
        CARD_CONTAINER.appendChild(card);

        setCardDetails(card, book);
	})
}

const firstBook = new Book("All Quiet on the Western Front", "Erich Maria Remarque", 200);
const secondBook = new Book("The Count of Monte Cristo", "Alexandre Dumas and Auguste Maquet", 1276);
addBookToLibrary(firstBook);
addBookToLibrary(secondBook)

displayBooks()
