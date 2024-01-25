import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/home-layout/home-layout.component').then(
        (m) => m.HomeLayoutComponent
      ),
    children: [
      {
        path: 'books',
        loadComponent: () =>
          import('./pages/books/books.component').then((m) => m.BooksComponent),
      },
      {
        path: 'books-saved',
        loadComponent: () =>
          import('./pages/books-saved/books-saved.component').then(
            (m) => m.BooksSavedComponent
          ),
      },

      {
        path: 'books/:id',
        loadComponent: () =>
          import('./pages/book/book.component').then((m) => m.BookComponent),
      },
      {
        path: '**',
        redirectTo: 'books',
      },
    ],
  },
];
