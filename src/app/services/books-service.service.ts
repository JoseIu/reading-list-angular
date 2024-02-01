import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import library from '../../db/books.json';
import { Book } from '../interfaces/book.interface';
import { Books } from '../interfaces/books.interface';

@Injectable({
  providedIn: 'root',
})
export class BooksServiceService {
  public initialBooks: Books = library;
  public _books = new BehaviorSubject<Books>(library);
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

    //find the book in the initialBooks
    const bookToRemove = this.initialBooks.library.find((book) => book.book.ISBN === ISBN);

    //if the book exists, add it back to _books
    if (bookToRemove) {
      const currentBooks = this._books.getValue().library;
      // Check if the book already exists in _books
      if (!currentBooks.find((book) => book.book.ISBN === ISBN)) {
        this._books.next({ library: [...currentBooks, bookToRemove] });
      }
    }
  }

  public getSavedBooks(): string[] {
    const savedBooks = JSON.parse(localStorage.getItem('saved-book') || '[]');

    return savedBooks;
  }
  public getBookByISBN(id: string): Observable<Book> {
    const foundBook = this._books.getValue().library.find((book) => book.book.ISBN === id);
    if (!foundBook) return new Observable<Book>();
    return of(foundBook);
  }

  //Update s_savedBooks from localStorage
  public updateSavedBooks(id: string): void {
    const savedBooks = JSON.parse(localStorage.getItem('saved-book') || '[]');

    this._savedBooks.next(savedBooks);
  }

  public filterBooks(search?: string, range?: number, filterBy?: string): void {
    const searchTerm = search || '';
    const rangee = range || 0;
    const filterByy = filterBy || '';

    const savedBooks = this.getSavedBooks();

    let initialBooks =
      this.initialBooks.library.filter((book) => !savedBooks.includes(book.book.ISBN)) || [];

    let filteredBooks = this.searchByName(initialBooks, searchTerm);
    filteredBooks = this.filterByGender(filteredBooks, filterByy);
    filteredBooks = this.filterByPages(filteredBooks, rangee);

    this._books.next({ library: filteredBooks });
  }

  // onlySaved(books: Book[], search?: boolean): Book[] {
  //   if (!search) return books;
  //   return books.filter((book) => this._savedBooks.getValue().includes(book.book.ISBN));
  // }

  searchByName(books: Book[], search: string): Book[] {
    if (!search) return [...books];
    const normalizedSearch = search.toLowerCase();

    return books.filter((book) => book.book.title.toLowerCase().includes(normalizedSearch));
  }

  filterByPages(books: Book[], pages: number): Book[] {
    if (!pages) return [...books];

    return books.filter(({ book }) => book.pages >= pages);
  }
  filterByGender(books: Book[], gender: string): Book[] {
    if (gender === 'all' || !gender) return books;
    const lowerCaseGender = gender.toLowerCase();

    return books.filter(({ book }) => book.genre.toLowerCase() === lowerCaseGender);
  }
}
