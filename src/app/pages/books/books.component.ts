import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Book } from '../../interfaces/book.interface';
import { BooksServiceService } from '../../services/books-service.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent implements OnInit {
  private booksService = inject(BooksServiceService);
  public books?: Book[];

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks(): void {
    this.booksService.books$.subscribe((books) => {
      this.books = books.library;
    });

    console.log(this.books);
  }

  onSaveBook(ISBN: string): void {
    this.booksService.saveBook(ISBN);
  }
}
