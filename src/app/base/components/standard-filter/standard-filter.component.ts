import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, UntypedFormControl, FormGroup, Validators } from '@angular/forms';
import { BaseService } from '../../base.service';
import { StandardTableSettingsService } from '../standard-table-settings/standard-table-settings.service';
import { FormFields } from '../../base.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'standard-filter',
  templateUrl: './standard-filter.component.html',
  styleUrls: ['./standard-filter.component.scss']
})
export class StandardFilterComponent implements OnInit {

  @Input() title: string = "";
  @Input() disabledButtons: boolean = false;
  @Input() showButtonAdd: boolean = false;
  @Input() showSearch: boolean = true;
  @Input() showButtonCustom: boolean = false;
  @Input() titleButtonCustom: string = "Button Custom";
  @Input() showButtonFilter: boolean = false;
  @Input() showButtonReset: boolean = false;
  @Input() showButtonExport: boolean = false;
  @Input() formFields;
  @Input() preFilledData: any;
  @Output() settingsChanged = new EventEmitter<any[]>();
  @Input() columns: any[];

  @Output() openModalNew = new EventEmitter();
  @Output() changeAmount = new EventEmitter();
  @Output() searchValue = new EventEmitter();
  @Output() exportExcel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();
  @Output() onButtonCustom = new EventEmitter();
  @Output() onReset = new EventEmitter();

  visibleAmount = true;
  perPageList = [10, 50, 100, 250, 500, 750, 1000];
  perPageValue: string = '10';
  archivedButton: boolean = false;
  dynamicForm: FormGroup;
  dataCache: { [key: string]: any[] } = {};

  SearchForm = new FormGroup({
    name: new UntypedFormControl("")
  })

  @Input() value: string = "";

  constructor(
    private baseService: BaseService,
    public standardTableSettingsService: StandardTableSettingsService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe(response => {
      if (response['perPage']) {
        this.perPageValue = response['perPage'];
      }
    })
  }


  ngOnInit(): void {
    this.SearchForm.get("name")?.setValue(this.value);
    this.createFormControls();
    this.initializeSelectFields();
    this.initializeSetDate();

    if (this.preFilledData) {
      this.prepareForUpdate();
    }
  }

  createFormControls() {
    const formControls = this.formFields.reduce((acc, field) => {
      const isRequired = field.required ? Validators.required : null;
      acc[field.key] = this.fb.control(
        { value: field.default || null, disabled: field.disabled },
        isRequired
      );
      return acc;
    }, {});
    this.dynamicForm = this.fb.group(formControls);
  }

  initializeSelectFields() {
    this.formFields
      .filter(field => field.type === "select-internal" && field.url)
      .forEach(field => this.populateInternalSelect(field));
  }

  populateInternalSelect(field: FormFields) {
    if (this.dataCache[field.key]) return;
    this.baseService.getCacheInternal(field.url)
      .subscribe(data => this.dataCache[field.key] = data);
  }

  initializeSetDate() {
    const date = new Date();

    for (const field of this.formFields) {
      if (field.type === "date") {
        let adjustedDate = new Date(date);

        if (field.dateRange !== undefined) {
          const dateRange = parseInt(field.dateRange, 10);
          adjustedDate.setDate(date.getDate() + dateRange);
        }

        this.dynamicForm.get(field.key).setValue(adjustedDate.toISOString().split('T')[0]);
      }
    }
  }

  prepareForUpdate() {
    this.dynamicForm.patchValue(this.preFilledData);
  }

  onVinculumChange(value: string, field: FormFields): void {
    const extraAction = field.extraAction;
    if (!extraAction || value === undefined || value.length === 0) {
      return;
    }

    if (extraAction.type === 'request-vinculum' && typeof extraAction.vinculum === 'string') {
      const route = extraAction.route.replace('{params}', value);
      this.populateCacheWithVinculum(route, extraAction.vinculum, extraAction.type);
    }
  }

  populateCacheWithVinculum(route: string, key: string, type?: string): void {
    if (this.dataCache[key] && type !== 'request-vinculum') {
      return;
    }

    this.baseService.getCacheInternal(route).subscribe(data => {
      this.dataCache[key] = data;
    });
  }

  clearFieldCache(fieldKey: string): void {
    if (this.dataCache[fieldKey]) {
      delete this.dataCache[fieldKey];
    }
  }

  setChangeAmount(input: any) {
    const value = parseInt(input.value);
    this.changeAmount.emit(value);
  }

  searchItem(input: any) {
    let search = input.value
    return this.searchValue.emit(search);
  }

  openModal() {
    this.openModalNew.emit(true);
  }

  submit() {
    const data = this.prepareFormData();
    this.onSubmit.emit(data);
  }

  buttonCustom() {
    const data = this.prepareFormData();
    this.onButtonCustom.emit(data);
  }

  reset() {
    this.dynamicForm.reset();
    this.clearAllFieldCaches();
    this.initializeSetDate();
    this.onReset.emit(true);
  }

  clearAllFieldCaches(): void {
    this.dataCache = {};
  }

  prepareFormData(): any {
    const formData = { ...this.dynamicForm.value };
    Object.keys(formData).forEach(key => {
      if (formData[key] === null) {
        delete formData[key];
      }
    });

    this.formFields.forEach(field => {
      if (!formData[field.key]) {
        delete formData[field.key];
      }
    });

    return formData;
  }

  fieldShow(item: any): boolean {
    const includeValue = item.includeView ? this.dynamicForm.get(item.includeView.key)?.value : undefined;
    const deleteValue = item.deleteView ? this.dynamicForm.get(item.deleteView.key)?.value : undefined;

    return !(item.includeView && includeValue !== item.includeView.value) && !(item.deleteView && deleteValue === item.deleteView.value);
  }

  isFieldVisible(item: FormFields): boolean {
    return item.visible && this.fieldShow(item);
  }

  getFieldClasses(item: FormFields): string {
    if (!this.isFieldVisible(item)) {
      return '';
    }
    let classes = 'textField ' + item.type;
    if (item.stylesField) {
      classes += ' ' + item.stylesField;
    }
    return classes;
  }

  exportTableExcel() {
    const data = this.prepareFormData();
    this.exportExcel.emit(data);
  }

  openSettings(): void {
    this.standardTableSettingsService.showSettings();
  }

  columnsSettings(event: any) {
    this.settingsChanged.emit(event);
  }
}
