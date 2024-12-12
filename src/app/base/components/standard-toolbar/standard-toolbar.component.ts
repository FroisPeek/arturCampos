import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'standard-toolbar',
  templateUrl: './standard-toolbar.component.html',
  styleUrls: ['./standard-toolbar.component.scss']
})
export class StandardToolbarComponent implements OnInit {

  @Input() placeholder: string = "";
  @Input() title: string = "";
  @Input() showSearch: boolean = true;
  @Input() showButtonAdd: boolean = false;
  @Input() showButtonDelete: boolean = false;
  @Input() showButtonArchive: boolean = false;
  @Input() isArchivedView: boolean = false;

  @Output() openModalNew = new EventEmitter<void>();
  @Output() openModalDelete = new EventEmitter<void>();
  @Output() changeAmount = new EventEmitter<number>();
  @Output() searchValue = new EventEmitter<string>();
  @Output() archiveItems = new EventEmitter<void>();
  @Output() restoreItems = new EventEmitter<void>();

  visibleAmount = true;
  perPageList = [10, 50, 100, 250, 500, 750, 1000];
  perPageValue: string = '10';
  searchForm = new FormGroup({
    name: new UntypedFormControl("")
  });

  @Input() value: string = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService
  ) {
    this.activatedRoute.queryParams.subscribe(response => {
      if (response['perPage']) {
        this.perPageValue = response['perPage'];
      }

      if (response['search']) {
        this.value = response['search'];
      }
    });
  }

  ngOnInit(): void {
    this.translate.get('TOOLBAR.SEARCH_PLACEHOLDER').subscribe((translatedPlaceholder: string) => {
      this.placeholder = translatedPlaceholder;
    });

    this.translate.get(`${this.title}`).subscribe((translatedTitle: string) => {
      this.title = translatedTitle;
    });

    this.searchForm.get("name")?.setValue(this.value);
    this.searchForm.get('name')?.valueChanges
      .pipe(debounceTime(500))
      .subscribe(value => {
        this.searchValue.emit(value);
      });
  }

  setChangeAmount(input: any): void {
    const value = parseInt(input.value);
    this.changeAmount.emit(value);
  }

  openDeleteModal(): void {
    this.openModalDelete.emit();
  }

  openAddModal(): void {
    this.openModalNew.emit();
  }
}
