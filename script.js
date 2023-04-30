let library = [];

function Book(name, author, numPages, hasBeenRead = false) {
	// Constructor
	this.name = name;
	this.author = author;
	this.numPages = numPages;
	this.hasBeenRead = hasBeenRead;
}

function addBookToLibrary(book) {
	library.push(book);
}

const firstBook = new Book("a", "b", 123);
addBookToLibrary(firstBook);
