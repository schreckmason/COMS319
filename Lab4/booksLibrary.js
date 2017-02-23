//Following logic reflects ex05_objects.js within the lab files directory

class Library{
	//Map of shelf objects to allow books to be pushed to a structure
	constructor(){
		this.shelves = {
			"art" : new Shelf(),
			"science" : new Shelf(),
			"sport" : new Shelf(),
			"lit" : new Shelf()
		}
	for(var i=0; i<25; i++){
		Book b = new Book("B"+i);
		this.addBook(b);
	}
	}

	addBook(book){
		//Switch statement instead
		switch(book.id%4){
			case 0:
				this.shelves.art.add(book);
				break;
			case 1:
				this.shelves.science.add(book);
				break;
			case 2:
				this.shelves.sport.add(book);
				break;

			case 3:
				this.shelves.lit.add(book);
				break;
			default:
				alert("no valid book id found for "+book.name);
				break;
		}
	}
}


class Shelf{
	constructor(){
	this.books=[];
	}

	add(book){
		this.books.push(book);
	}
}

class Book{
	constructor(b){
		this.name = b;
		this.id = Math.floor(Math.random() * 1000);
		}
}
