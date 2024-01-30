import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from '../../interfaces/book.interface';

@Component({
  selector: 'card-book',
  standalone: true,
  imports: [],
  templateUrl: './card-book.component.html',
  styleUrl: './card-book.component.scss',
})
export class CardBookComponent {
  @Input() book?: Book;

  @Output() bookId: EventEmitter<string> = new EventEmitter<string>();

  public onSaveBook(id: string): void {
    this.bookId.emit(id);
  }
}
