import { Component, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardBookComponent } from '../../components/card-book/card-book.component';
import { Book } from '../../interfaces/book.interface';
import { BooksServiceService } from '../../services/books-service.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [RouterModule, CardBookComponent],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent implements OnInit, OnChanges {
  private booksService = inject(BooksServiceService);
  public books?: Book[];

  ngOnInit(): void {
    //check if we have saved books
    const savedBooks: string[] = this.booksService.getSavedBooks();
    console.log('SAVED-BOOKS', savedBooks.length);

    if (savedBooks.length === 0) {
      this.getBooks();

      return;
    }
    this.setNewBooks(savedBooks);
    // this.getBooks();
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('CHANGES', changes);
  }

  public getBooks(): void {
    this.booksService.books$.subscribe((books) => (this.books = books.library));

    // console.log('GET-BOOKS', this.books);
  }

  public onSaveBook(ISBN: string): void {
    //save book in localStorage
    this.booksService.saveBook(ISBN);
    //update and save _savedBooks
    this.booksService.updateSavedBooks(ISBN);
  }

  //Only if we have saved books
  public setNewBooks(savedBooks: string[]): void {
    if (savedBooks.length) {
      console.log(savedBooks);
      this.booksService.books$.subscribe((books) => {
        this.books = books.library.filter((book) => !savedBooks.includes(book.book.ISBN));
      });
    }
  }
}
