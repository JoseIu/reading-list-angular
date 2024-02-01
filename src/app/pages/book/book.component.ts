import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { switchMap } from 'rxjs';
import { ArrowBackComponent } from '../../components/arrow-back/arrow-back.component';
import { Book } from '../../interfaces/book.interface';
import { BooksServiceService } from '../../services/books-service.service';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [ArrowBackComponent, RouterModule],
  templateUrl: './book.component.html',
  styleUrl: './book.component.scss',
})
export class BookComponent implements OnInit {
  private activateRoute = inject(ActivatedRoute);
  private booksService = inject(BooksServiceService);

  public book?: Book;
  ngOnInit(): void {
    this.activateRoute.params
      .pipe(switchMap(({ id }) => this.booksService.getBookByISBN(id)))
      .subscribe((book) => {
        this.book = book;
      });
  }
}
