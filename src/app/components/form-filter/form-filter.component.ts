import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BooksServiceService } from '../../services/books-service.service';

@Component({
  selector: 'form-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-filter.component.html',
  styleUrl: './form-filter.component.scss',
})
export class FormFilterComponent implements OnInit, OnDestroy {
  public booksService = inject(BooksServiceService);
  myForm = new FormGroup({
    search: new FormControl(''),
    range: new FormControl<number>(0),
    sortBy: new FormControl('all'),
  });

  ngOnInit(): void {
    this.myForm.valueChanges.subscribe((formValues) => {
      const { search, range, sortBy } = formValues;
      const sortByy = sortBy || '';

      const rangeToInteger = Number(range);

      this.booksService.filterBooks(search?.toLocaleLowerCase(), rangeToInteger, sortByy);
    });
  }
  ngOnDestroy(): void {
    this.myForm.reset();
  }
}
