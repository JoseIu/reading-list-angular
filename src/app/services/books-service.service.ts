import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import library from '../../db/books.json';
import { Books } from '../interfaces/books.interface';

@Injectable({
  providedIn: 'root',
})
export class BooksServiceService {
  public initialBooks: Books = library;
  private _books = new BehaviorSubject<Books>(library);
  public books$ = this._books.asObservable();

  //to save only the ISBN of the book
  private _savedBooks = new BehaviorSubject<string[]>([]);
  public savedBooks$ = this._savedBooks.asObservable();

  public saveBook(ISBN: string): void {
    const foundBook = this._books.getValue().library.find((book) => book.book.ISBN === ISBN);

    if (!foundBook) return;

    const newBooks = this._books.getValue().library.filter((book) => book !== foundBook);

    const savedBooks = JSON.parse(localStorage.getItem('saved-book') || '[]');

    localStorage.setItem('saved-book', JSON.stringify([...savedBooks, foundBook.book.ISBN]));

    this._books.next({ library: newBooks });

    console.log('_BOOKS', this._books);
  }
  public removeBook(ISBN: string): void {
    const booksInsStorage: string[] = this.getSavedBooks();

    //filter the book selected
    const newBooks = booksInsStorage.filter((book) => book !== ISBN);

    //update _savedBooks
    this._savedBooks.next(newBooks);
    //update localStorage with the newBooks saved
    localStorage.setItem('saved-book', JSON.stringify(newBooks));
  }

  public getSavedBooks(): string[] {
    const savedBooks = JSON.parse(localStorage.getItem('saved-book') || '[]');

    return savedBooks;
  }

  //Update s_savedBooks from localStorage
  public updateSavedBooks(id: string): void {
    const savedBooks = JSON.parse(localStorage.getItem('saved-book') || '[]');

    this._savedBooks.next(savedBooks);
  }
}
