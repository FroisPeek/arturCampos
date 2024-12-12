import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { PaginateInterface } from '../../paginate.interface';
import { StandardTableToolsService } from './standard-table-tools.service';
import { Subscription } from 'rxjs';
import { NgxMaskService } from 'ngx-mask';
import { TranslateService } from '@ngx-translate/core';

export interface Header {
  key: string;
  value: string;
  type: 'text' | 'image' | 'status';
  mask?: string;
  visible?: boolean;
  format?: (item: any) => string;
}

interface TableItem {
  id: string;
  data: string[];
}

@Component({
  selector: 'standard-table-tools',
  templateUrl: './standard-table-tools.component.html',
  styleUrls: ['./standard-table-tools.component.scss']
})
export class StandardTableToolsComponent implements OnInit {
  headersSubscription: Subscription;
  @Input() reportName: string = '';
  @Input() headerCustom: boolean = false;
  @Input() customBody: boolean = false;
  @Input() showUpdateButton: boolean = false;
  @Input() pagination: boolean = true;
  @Input() showCustomButton: boolean = false;
  @Input() iconCustomButton: string = 'bx bx-show';
  @Input() showViewButton: boolean = false;
  @Input() showImage: boolean = false;
  @Input() showDeleteButton: boolean = false;
  @Input() showCheckbox: boolean = false;
  @Input() query: PaginateInterface<any> = {
    page: 1,
    perPage: 10,
    countPage: 1,
    sortBy: 'createdAt',
    sort: 'desc',
    total: 10,
    items: []
  };
  @Input() paginationId: string = 'paginate';
  @Input() paginationIdTag?: string;
  @Input() headers: Header[] = [];

  @Output() modalUpdateItem = new EventEmitter();
  @Output() modalCustomItem = new EventEmitter();
  @Output() modalViewItem = new EventEmitter();
  @Output() changePageData = new EventEmitter();
  @Output() listItemsDelete = new EventEmitter();
  @Output() sortItemsField = new EventEmitter();
  @Output() exportExcel = new EventEmitter();
  @Output() itemDelete = new EventEmitter();
  @Output() itemSelect = new EventEmitter<{ target: EventTarget; item: { id: string } }>();

  listIDsRemove: any[] = [];
  listItemsTableContainer: TableItem[] = [];
  selectedItems: Set<string> = new Set();
  windowWidth: number = window.innerWidth;
  shouldScroll: boolean = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private headerService: StandardTableToolsService,
    private maskApplierService: NgxMaskService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.generateHeader();
    if (this.headerCustom) {
      this.headersSubscription = this.headerService.headers$.subscribe(headers => {
        if (headers.length > 0) {
          this.headers = headers;
        }
        this.regenerateTable();
        this.changeDetectorRef.detectChanges();
      });
    } else {
      this.regenerateTable();
    }
    window.addEventListener('resize', this.onResize.bind(this));
  }

  get showOptionButton(): boolean {
    return this.showViewButton || this.showUpdateButton || this.showDeleteButton;
  }

  generateHeader() {
    this.headers = this.headers.map(header => ({
      ...header,
      visible: header.visible ?? true,
      value: this.translate.instant(header.value)
    }));
  }

  regenerateTable(): void {
    this.shouldScroll = this.headers.filter(column => column.visible).length > 5;
    this.listItemsTableContainer = this.generatedTable(this.query.items);
  }

  onResize(): void {
    this.windowWidth = window.innerWidth;
  }

  sortItems(field: string): void {
    this.sortItemsField.emit(field);
  }

  openModalUpdateItem(id: any): void {
    this.modalUpdateItem.emit(id);
  }

  openModalCustomItem(id: any): void {
    this.modalCustomItem.emit(id);
  }

  openModalViewItem(id: any): void {
    this.modalViewItem.emit(id);
  }

  changePage(event: any): void {
    this.changePageData.emit(event);
    this.regenerateTable();
    this.changeDetectorRef.detectChanges();
  }

  exportTableExcel(): void {
    this.exportExcel.emit(true);
  }

  deleteItem(itemID: string): void {
    this.itemDelete.emit(itemID);
  }

  selectAll(event: Event): void {
    const checkbox: HTMLInputElement = <HTMLInputElement>event.target;
    if (checkbox.checked) {
      this.query.items.forEach(item => this.selectedItems.add(item.id));
    } else {
      this.query.items.forEach(item => this.selectedItems.delete(item.id));
    }
    this.query.items.forEach(item => this.itemSelect.emit({ target: event.target, item }));
  }

  selectItem(event: Event, itemID: string): void {
    const checkbox: HTMLInputElement = <HTMLInputElement>event.target;
    if (checkbox.checked) {
      this.selectedItems.add(itemID);
    } else {
      this.selectedItems.delete(itemID);
    }
    this.itemSelect.emit({ target: event.target, item: { id: itemID } });
  }

  isSelected(itemID: string): boolean {
    return this.selectedItems.has(itemID);
  }

  generatedTable(items: any[]): TableItem[] {
    let listFinalTable: TableItem[] = [];

    for (let item of items) {
      let listItems: string[] = [];

      for (let { visible, key, mask, format, type } of this.headers) {
        if (visible) {
          let itemHeader = item[key];
          let formattedValue = itemHeader;

          if (type === 'status') {
            if (format) {
              formattedValue = format(item);
              formattedValue = this.translate.instant(formattedValue);
            }

            const statusClass = itemHeader.toLowerCase();
            listItems.push(`<span class="badge badge-${statusClass}">${formattedValue}</span>`);
          } else if (type === 'image') {
            listItems.push(`<img src="${itemHeader}" alt="Image" class="table-image">`);
          } else {
            if (format) {
              itemHeader = format(item);
              itemHeader = this.translate.instant(itemHeader);
            }

            if (mask && typeof itemHeader === 'string') {
              itemHeader = this.applyMask(itemHeader, mask);
            }

            if (typeof itemHeader !== 'undefined') {
              if (typeof itemHeader === 'boolean') {
                const translatedBoolean = itemHeader ? this.translate.instant('COMMON.YES') : this.translate.instant('COMMON.NO');
                listItems.push(translatedBoolean);
              } else if (itemHeader === 'active' || itemHeader === 'inactive') {
                const translatedStatus = itemHeader === 'active' ? this.translate.instant('COMMON.ACTIVE') : this.translate.instant('COMMON.INACTIVE');
                listItems.push(translatedStatus);
              } else {
                listItems.push(itemHeader);
              }
            }
          }
        }
      }

      listFinalTable.push({
        id: item.id,
        data: listItems
      });
    }

    return listFinalTable;
  }

  calculateOptionMaxWidth(): string {
    if (this.showUpdateButton && this.showDeleteButton && this.showViewButton) {
      return '8%';
    } else if ((this.showUpdateButton && this.showDeleteButton) || (this.showUpdateButton && this.showViewButton) || (this.showViewButton && this.showDeleteButton)) {
      return '6%';
    } else if (this.showUpdateButton || this.showDeleteButton || this.showViewButton) {
      return '2%';
    } else {
      return '';
    }
  }

  getHeaderVisible(): Header[] {
    return this.headers.filter(header => header.visible);
  }

  get paginatedItems() {
    const startIndex = (this.query.page - 1) * this.query.perPage;
    const endIndex = startIndex + this.query.perPage;
    return this.query.items.slice(startIndex, endIndex);
  }

  applyMask(value: string, mask: string): string {
    return this.maskApplierService.applyMask(value, mask);
  }
}
