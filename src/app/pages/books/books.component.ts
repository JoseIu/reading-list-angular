import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardBookComponent } from '../../components/card-book/card-book.component';
import { FormFilterComponent } from '../../components/form-filter/form-filter.component';
import { Book } from '../../interfaces/book.interface';
import { BooksServiceService } from '../../services/books-service.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [RouterModule, CardBookComponent, FormFilterComponent],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent implements OnInit {
  private booksService = inject(BooksServiceService);
  public books?: Book[];

  ngOnInit(): void {
    //check if we have saved books
    const savedBooks: string[] = this.booksService.getSavedBooks();

    if (savedBooks.length === 0) {
      this.getBooks();

      return;
    }
    this.setNewBooks(savedBooks);
  }

  public getBooks(): void {
    this.booksService.books$.subscribe((books) => (this.books = books.library));
  }

  public onSaveBook(ISBN: string): void {
    //save book in localStorage
    this.booksService.saveBook(ISBN);
    //update and save _savedBooks
    this.booksService.updateSavedBooks(ISBN);
  }

  //Set new books when we add to saved-books (Only if we have saved books)
  public setNewBooks(savedBooks: string[]): void {
    if (savedBooks.length) {
      this.booksService.books$.subscribe((books) => {
        this.books = books.library.filter((book) => !savedBooks.includes(book.book.ISBN));
      });
    }
  }
}
