import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormFields } from '../../base.interface';

@Component({
    selector: 'core-modal-action',
    templateUrl: './modal-action.component.html',
    styleUrls: ['./modal-action.component.scss']
})

export class ModalActionComponent implements OnInit {
    @Input() formFields: FormFields[];
    @Input() preFilledData: any;
    @Input() titleModal: 'create' | 'update' = 'create'

    constructor(
        public activeModal: NgbActiveModal
    ) { }

    ngOnInit(): void {
        if (this.preFilledData) {
            this.titleModal = 'update';
        }
    }

    onFormSubmit({ item, onSuccess, onError }): void {
        this.setCloseModal(true, item);
        onSuccess();
    }

    setCloseModalAction(result: boolean): void {
        this.activeModal.close({
            success: result
        });
    }

    setCloseModal(result: boolean, response?: { data: any, type: string }): void {
        this.activeModal.close({
            success: result,
            data: response.data,
            type: response.type,
        });
    }
}
