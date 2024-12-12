import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { FormFields, ViewCondition } from '../../base.interface';
import { BaseService } from '../../base.service';
import { CryptoService } from '../../services/crypto.service';
import { SelectIconComponent } from '../select-icon/select-icon.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { addDays } from 'date-fns';
import { forkJoin, Observable } from 'rxjs';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { ModalActionComponent } from '../modal-action/modal-action.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'core-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit {
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;

  @Input() formFields: FormFields[];
  @Input() preFilledData: any;
  @Output() saveClicked = new EventEmitter<{ item: { type: string, data: any }, onSuccess: () => void, onError: () => void }>();
  @Output() cancelClicked = new EventEmitter();

  capturedImages: Record<string, string | null> = {};
  videoStreams: Record<string, MediaStream | null> = {};

  dynamicForm: FormGroup;
  loading = false;
  operation: 'create' | 'update' = 'create';

  dataCache: Record<string, any[]> = {};
  listCache: Record<string, any[]> = {};
  renderImage: Record<string, string> = {};

  showPassword = false;
  dependentFields: FormFields[] = [];
  private isManagingFields: boolean = false;

  constructor(
    private baseService: BaseService,
    private fb: FormBuilder,
    private cryptoService: CryptoService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    const user = this.getUserData();
    this.filterFieldsByUserLevel(user.level, user.type);
    this.createFormControls();
    this.setupDependentFields();
    this.patchFormWithPreFilledData();
    this.initializeSelectFields();
    this.initializeDateFields();
    this.initializeWebcamFields();
  }

  private getUserData(): any {
    return this.cryptoService.localDecrypt(localStorage.getItem('user'));
  }

  private initializeWebcamFields(): void {
    this.formFields.forEach((field) => {
      if (field.type === 'webcam' && this.preFilledData?.[field.key]) {
        this.capturedImages[field.key] = this.preFilledData[field.key];
      } else {
        this.capturedImages[field.key] = null;
      }
    });
  }

  private filterFieldsByUserLevel(level: string, type: string): void {
    const includesFields = [];

    for (const field of this.formFields) {
      if (field.level && !field.level.includes(String(level))) {
        continue;
      } else if (field.flagTypeUnit && !field.flagTypeUnit.includes(String(type))) {
        continue;
      } else {
        includesFields.push(field);
      }
    }

    this.formFields = includesFields;
    this.dependentFields = this.formFields.filter(field => field.deleteView || field.includeView);
  }

  private createFormControls(): void {
    const formControls = this.formFields.reduce((controls, field) => {
      const validators = [];

      if (field.required) {
        validators.push(Validators.required);
      }

      if (field.validators) {
        field.validators.forEach((validator) => {
          validators.push(validator.function());
        });
      }

      controls[field.key] = this.fb.control(
        { value: field.default || null, disabled: field.disabled },
        validators
      );

      return controls;
    }, {} as { [key: string]: AbstractControl });

    this.dynamicForm = this.fb.group(formControls);
  }

  private setupDependentFields(): void {
    this.dependentFields.forEach(field => {
      if (field.deleteView?.key) {
        this.dynamicForm.get(field.deleteView.key)?.valueChanges
          .pipe(distinctUntilChanged())
          .subscribe(() => this.manageConditionalFields());
      }
      if (field.includeView?.key) {
        this.dynamicForm.get(field.includeView.key)?.valueChanges
          .pipe(distinctUntilChanged())
          .subscribe(() => this.manageConditionalFields());
      }
      if (field.requiredView?.key) {
        this.dynamicForm.get(field.requiredView.key)?.valueChanges
          .pipe(distinctUntilChanged())
          .subscribe(() => this.manageRequiredFields());
      }
      if (field.notRequiredView?.key) {
        this.dynamicForm.get(field.notRequiredView.key)?.valueChanges
          .pipe(distinctUntilChanged())
          .subscribe(() => this.manageRequiredFields());
      }
    });
  }

  private patchFormWithPreFilledData(): void {
    if (this.preFilledData) {
      this.operation = 'update';
      this.dynamicForm.patchValue(this.preFilledData);

      this.formFields.forEach(field => {
        if (field.type === 'upload-file' && this.preFilledData[field.key]) {
          this.renderImage[field.key] = this.preFilledData[field.key];
        }
        if (field.type === 'list-forms' && this.preFilledData[field.key]) {
          this.listCache[field.key] = this.preFilledData[field.key];
        }
      });
    }
  }

  private initializeSelectFields(): void {
    const selectInternalFields = this.formFields.filter(field => field.type === 'select-internal' && field.url);

    forkJoin(
      selectInternalFields.map(field => this.populateInternalSelect(field))
    ).subscribe();
  }

  private initializeDateFields(): void {
    const currentDate = new Date();
    this.formFields.forEach(field => {
      if ((field.type === 'date' || field.type === 'date-time') && !this.preFilledData?.[field.key]) {
        const adjustedDate = addDays(currentDate, parseInt(field.dateRange || '0', 10));
        const formattedDate = this.formatDate(adjustedDate, field.type);
        this.dynamicForm.get(field.key)?.setValue(formattedDate);
      }
    });
  }

  private formatDate(date: Date, type: string): string {
    if (type === 'date') {
      return date.toISOString().split('T')[0];
    } else if (type === 'date-time') {
      const datePart = date.toLocaleDateString('sv-SE');
      const timePart = date.toLocaleTimeString('sv-SE', { hour12: false, hour: '2-digit', minute: '2-digit' });
      return `${datePart}T${timePart}`;
    }
    return '';
  }

  private populateInternalSelect(field: FormFields): Observable<any> {
    if (this.dataCache[field.key]) return;
    return this.baseService.getCacheInternal(field.url).pipe(
      tap(data => this.dataCache[field.key] = data)
    );
  }

  createSelectImageStyle(image: string): string {
    return `background: url('${image}'); background-size: cover;`;
  }

  isFieldVisible(field: FormFields): boolean {
    return field.visible && this.shouldIncludeField(field);
  }

  getFieldClasses(field: FormFields): string {
    if (!this.isFieldVisible(field)) return '';
    let classes = 'textField ' + field.type;
    if (field.stylesField) {
      classes += ' ' + field.stylesField;
    }
    return classes;
  }

  isLabelVisible(field: FormFields): boolean {
    return field.type !== 'dashed' ? field.visible && this.isFieldVisible(field) : false;
  }

  trackByKey(index: number, item: FormFields): string {
    return item.key;
  }

  onSubmit(): void {
    if (this.dynamicForm.valid) {
      this.loading = true;
      const formData = this.prepareFormData();
      this.saveClicked.emit({
        item: { type: this.operation, data: formData },
        onSuccess: this.handleSuccess.bind(this),
        onError: this.handleError.bind(this)
      });
    }
  }

  private prepareFormData(): any {
    const formData = { ...this.dynamicForm.value };
    this.formFields.forEach(field => {
      if (!this.shouldIncludeField(field)) {
        delete formData[field.key];
      }

      if (field.type === 'list-forms' && this.listCache[field.key]) {
        formData[field.key] = this.listCache[field.key];
      }
    });

    if (this.operation !== 'update') {
      delete formData.id;
    }
    return this.cleanNullValues(formData);
  }

  private cleanNullValues(formData: any): any {
    Object.keys(formData).forEach(key => {
      if (formData[key] === null) {
        delete formData[key];
      }
    });
    return formData;
  }

  private handleSuccess(): void {
    this.dynamicForm.reset();
    this.loading = false;
  }

  private handleError(): void {
    this.loading = false;
  }

  onVinculumChange(value: string, field: FormFields): void {
    const extraAction = field.extraAction;
    if (!extraAction) {
      return;
    }

    if (value === undefined || value.length === 0) {
      this.resetVinculumCache(field);
      return;
    }

    if (extraAction.type === 'request-vinculum') {
      const route = extraAction.route.replace('{params}', value);
      this.populateCacheWithVinculum(route, extraAction.vinculum);
    }
  }

  private resetVinculumCache(field: FormFields): void {
    const extraAction = field.extraAction;
    if (!extraAction) {
      return;
    }

    if (typeof extraAction.vinculum === 'string') {
      const vinculumKey = extraAction.vinculum;
      const vinculumField = this.formFields.find(f => f.key === vinculumKey);

      if (vinculumField && vinculumField.url) {
        this.baseService.getCacheInternal(vinculumField.url).subscribe(data => {
          this.dataCache[vinculumKey] = data;
        });
      }
    }
  }

  private populateCacheWithVinculum(route: string, vinculum: string | string[]): void {
    if (this.dataCache[route]) return;

    this.baseService.getCacheInternal(route).subscribe(data => {
      console.log(data);
      if (typeof vinculum === 'string') {
        this.updateFormControl(vinculum, data[vinculum] !== undefined ? data[vinculum] : data);
      } else if (Array.isArray(vinculum)) {
        vinculum.forEach(vinculumField => {
          this.updateFormControl(vinculumField, data[vinculumField] !== undefined ? data[vinculumField] : data);
        });
      }

      this.updateFormWithData(data);
    });
  }

  private updateFormControl(key: string, fieldData: any): void {
    const formControl = this.dynamicForm.get(key);
    if (formControl) {
      if (Array.isArray(fieldData)) {
        this.dataCache[key] = fieldData;
      } else if (typeof fieldData === 'object') {
        formControl.setValue(fieldData.key || fieldData.value || fieldData);
      } else {
        formControl.setValue(fieldData);
      }
    }
  }

  private updateFormWithData(data: any): void {
    Object.keys(data).forEach(key => {
      this.updateFormControl(key, data[key]);
    });
  }


  shouldIncludeField(field: FormFields): boolean {
    const includeCondition = field.includeView ? this.isFieldConditionMet(field.includeView) : true;
    const deleteCondition = field.deleteView ? !this.isFieldConditionMet(field.deleteView) : true;
    return includeCondition && deleteCondition;
  }

  private isFieldConditionMet(condition: ViewCondition): boolean {
    const controlValue = this.dynamicForm.get(condition.key)?.value;
    return Array.isArray(condition.value) ? condition.value.includes(controlValue) : controlValue === condition.value;
  }

  manageConditionalFields(): void {
    if (this.isManagingFields) {
      return;
    }

    this.isManagingFields = true;

    const fieldsToAdd = [];
    const fieldsToRemove = [];

    this.dependentFields.forEach(field => {
      const formControl = this.dynamicForm.get(field.key);
      const shouldInclude = this.shouldIncludeField(field);

      if (shouldInclude && !formControl) {
        fieldsToAdd.push(field);
      } else if (!shouldInclude && formControl) {
        fieldsToRemove.push(field);
      }
    });

    fieldsToAdd.forEach(field => {
      this.dynamicForm.addControl(field.key, this.fb.control(
        { value: field.default || null, disabled: field.disabled },
        field.required ? Validators.required : null
      ));
    });

    fieldsToRemove.forEach(field => {
      this.dynamicForm.removeControl(field.key);
      if (field.type === 'upload-file') {
        this.renderImage[field.key] = null;
      }
    });

    this.manageRequiredFields();

    this.isManagingFields = false;
  }

  private manageRequiredFields(): void {
    this.dependentFields.forEach(field => {
      const formControl = this.dynamicForm.get(field.key);
      if (this.shouldFieldBeRequired(field)) {
        formControl?.setValidators(Validators.required);
      } else {
        formControl?.clearValidators();
      }
      formControl?.updateValueAndValidity();
    });
  }

  private shouldFieldBeRequired(field: FormFields): boolean {
    const requiredCondition = field.requiredView ? this.isFieldConditionMet(field.requiredView) : false;
    const notRequiredCondition = field.notRequiredView ? !this.isFieldConditionMet(field.notRequiredView) : true;
    return requiredCondition && notRequiredCondition;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  convertFileToBase64AndUpdateForm(file: File | FileList, key: string): void {
    const fileToProcess = file instanceof FileList ? file[0] : file;
    if (fileToProcess) {
      this.readFileAsBase64(fileToProcess).then((base64String: string) => {
        this.dynamicForm.get(key)?.setValue(base64String);
        this.renderImage[key] = base64String;
      }).catch(error => {
        console.error('Error converting file:', error);
      });
    }
  }

  private readFileAsBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  openIconSelectionModal(key: string): void {
    const modalRef = this.modalService.open(SelectIconComponent, { size: 'lg' });
    const componentInstance = modalRef.componentInstance as SelectIconComponent;
    componentInstance.setModalRef(modalRef);

    modalRef.result.then(result => {
      if (result.successIcon) {
        this.dynamicForm.get(key)?.setValue(result.selectedIcon);
      }
    }, (reason) => {
      console.log('Modal dismissed: ', reason);
    });
  }

  openListFormModal(key: string, fields: FormFields[], item?: any, listIndex?: number): void {
    const modalRef = this.modalService.open(ModalActionComponent, { size: 'lg' });
    modalRef.componentInstance.formFields = fields;
    modalRef.componentInstance.preFilledData = item;
    modalRef.result.then(result => {
      if (result.success && result.data) {
        if (result.type === 'create') {
          this.addToListCache(key, result.data);
        } else if (result.type === 'update' && listIndex !== undefined) {
          this.updateListCache(key, result.data, listIndex);
        }
      }
    });
  }

  private addToListCache(key: string, data: any): void {
    if (!this.listCache[key]) {
      this.listCache[key] = [];
    }
    this.listCache[key].push(data);
  }

  private updateListCache(key: string, data: any, listIndex: number): void {
    if (this.listCache[key] && listIndex !== undefined) {
      this.listCache[key][listIndex] = data;
    }
  }

  deleteListItem(field: FormFields, key: string, listIndex: number): void {
    if (field.seeDelete && this.listCache[key]) {
      this.listCache[key].splice(listIndex, 1);
    }
  }

  getFirstErrorMessage(item: FormFields): string | null {
    const control = this.dynamicForm.get(item.key);

    if (control.errors?.required) {
      return this.translate.instant('FORMS.ERRORS.REQUIRED');
    }

    if (control && control.errors && Array.isArray(item.validators)) {
      for (const validator of item.validators) {
        if (control.errors["invalid"]) {
          return this.translate.instant(validator.message);
        }
      }
    }
    return null;
  }

  startWebcam(fieldKey: string): void {
    const constraints = {
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        facingMode: "user"
      }
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        this.videoStreams[fieldKey] = stream;
        const video = this.videoElement.nativeElement;
        video.srcObject = stream;
        video.play();
      })
      .catch((error) => {
        console.error('Error accessing webcam: ', error);
      });
  }


  captureImage(fieldKey: string): void {
    if (this.videoElement && this.canvasElement) {
      const canvas = this.canvasElement.nativeElement;
      const video = this.videoElement.nativeElement;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        this.capturedImages[fieldKey] = canvas.toDataURL('image/png');
        this.dynamicForm.get(fieldKey)?.setValue(this.capturedImages[fieldKey]);
        this.stopWebcam(fieldKey);
      }
    }
  }

  stopWebcam(fieldKey: string): void {
    if (this.videoStreams[fieldKey]) {
      this.videoStreams[fieldKey]?.getTracks().forEach((track) => track.stop());
      this.videoStreams[fieldKey] = null;
    }
  }

  retakePhoto(fieldKey: string): void {
    this.capturedImages[fieldKey] = null;
    this.startWebcam(fieldKey);
  }

  initializeFieldImage(fieldKey: string): string | null {
    return this.capturedImages[fieldKey];
  }

  cancelInsertion(): void {
    this.cancelClicked.emit();
  }
}