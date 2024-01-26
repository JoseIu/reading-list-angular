import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import library from '../../db/books.json';
import { Books } from '../interfaces/books.interface';

@Injectable({
  providedIn: 'root',
})
export class BooksServiceService {
  private _books = new BehaviorSubject<Books>(library);
  public books$ = this._books.asObservable();

  public saveBook(ISBN: string): void {
    const foundBook = this._books
      .getValue()
      .library.find((book) => book.book.ISBN === ISBN);

    if (!foundBook) return;

    const newBooks = this._books
      .getValue()
      .library.filter((book) => book !== foundBook);

    const savedBooks = JSON.parse(localStorage.getItem('saved-book') || '[]');

    localStorage.setItem(
      'saved-book',
      JSON.stringify([...savedBooks, foundBook.book.ISBN])
    );

    this._books.next({ library: newBooks });

    console.log('_BOOKS', this._books);
  }
}
