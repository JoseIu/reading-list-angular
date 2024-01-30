import { Component, OnInit, inject } from '@angular/core';
import { Book } from '../../interfaces/book.interface';
import { BooksServiceService } from '../../services/books-service.service';

@Component({
  selector: 'app-books-saved',
  standalone: true,
  imports: [],
  templateUrl: './books-saved.component.html',
  styleUrl: './books-saved.component.scss',
})
export class BooksSavedComponent implements OnInit {
  private booksService = inject(BooksServiceService);
  public booksSaved?: Book[];

  ngOnInit(): void {
    const booksInsStorage: string[] = this.booksService.getSavedBooks();

    this.getBooksInStorage(booksInsStorage);

    this.booksService.savedBooks$.subscribe((books) => {
      this.booksSaved = this.booksService.initialBooks.library.filter((book) =>
        books.includes(book.book.ISBN)
      );
    });
    if (booksInsStorage.length) {
      this.booksService.updateSavedBooks(booksInsStorage[0]);
    }
  }

  public getBooksInStorage(booksInsStorage: string[]): void {
    if (booksInsStorage.length) {
      // let initialBooks: Book[];
      // let newBooks: Book[];

      // this.booksService.books$.subscribe((books) => {
      //   initialBooks = books.library;

      //   newBooks = initialBooks.filter((book) => booksInsStorage.includes(book.book.ISBN));

      //   console.log('getBooksInStorage', newBooks);

      //   this.booksSaved = newBooks;
      // });

      this.booksSaved = this.booksService.initialBooks.library.filter((book) =>
        booksInsStorage.includes(book.book.ISBN)
      );
    }
  }

  public onRemoveBook(ISBN: string): void {
    this.booksService.removeBook(ISBN);
    // this.booksService.updateSavedBooks(ISBN);
  }
}
