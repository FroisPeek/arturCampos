import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/base/base.service';
import { FormFields } from 'src/app/base/base.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'core-create-update-modal',
    templateUrl: './create-update-modal.component.html',
    styleUrls: ['./create-update-modal.component.scss']
})
export class CreateUpdateModalComponent implements OnInit {
    @Input() router: string;
    @Input() formFields: FormFields[];
    @Input() preFilledData: any;
    @Input() screenTitle: string = '';

    modalTitle: string = '';

    constructor(
        private baseService: BaseService,
        private toastService: BaseService,
        public activeModal: NgbActiveModal,
        private translate: TranslateService
    ) { }

    ngOnInit(): void {
        this.modalTitle = this.preFilledData ? this.translate.instant('MODAL.UPDATE') : this.translate.instant('MODAL.CREATE');
    }
    handleFormSubmit({ item, onSuccess, onError }: { item: { type: string, data: any }, onSuccess: () => void, onError: () => void }): void {
        const request$ = item.type === 'create' ? this.createResource(item.data) : this.updateResource(item.data);

        request$.subscribe(
            response => this.onSuccess(response, onSuccess, item.type),
            error => this.onError(error, onError)
        );
    }

    private createResource(data: any): Observable<any> {
        return this.baseService.createItem(this.router, data);
    }

    private updateResource(data: any): Observable<any> {
        if (!this.preFilledData?.id) {
            this.toastService.error(this.translate.instant('MODAL.ERROR_ID_REQUIRED'));
            throw new Error(this.translate.instant('MODAL.ERROR_ID_REQUIRED'));
        }
        return this.baseService.updateItem(this.router, this.preFilledData.id, data);
    }

    private onSuccess(response: any, onSuccess: () => void, actionType: string): void {
        if (response) {
            onSuccess();
            const successMessage = actionType === 'create'
                ? this.translate.instant('MODAL.SUCCESS_CREATE')
                : this.translate.instant('MODAL.SUCCESS_UPDATE');
            this.toastService.success(successMessage);
            this.closeModal(true);
        }
    }

    private onError(error: any, onError: () => void): void {
        onError();
        this.displayErrorMessages(error);
    }

    private displayErrorMessages(errorResponse: any): void {
        const errors = errorResponse.error?.errors || errorResponse.errors;
        if (errors && typeof errors === 'object') {
            Object.values(errors).forEach((errorList: unknown) => {
                if (Array.isArray(errorList)) {
                    errorList.forEach((errorMessage: unknown) => {
                        if (typeof errorMessage === 'string') {
                            this.toastService.error(errorMessage);
                        }
                    });
                }
            });
        } else {
            const message = errorResponse.error?.message || this.translate.instant('MODAL.ERROR_UNKNOWN');
            this.toastService.error(this.translate.instant('MODAL.ERROR_GENERIC', { message }));
        }
    }

    closeModal(result: boolean): void {
        this.activeModal.close({ success: result });
    }

    getModalTitle(): string {
        return this.screenTitle ? `${this.modalTitle} ${this.screenTitle}` : this.modalTitle;
    }
}
