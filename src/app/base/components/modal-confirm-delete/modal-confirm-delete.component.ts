import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseService } from 'src/app/base/base.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-confirm-delete',
  templateUrl: './modal-confirm-delete.component.html',
  styleUrls: ['./modal-confirm-delete.component.scss']
})
export class ModalConfirmDeleteComponent {
  @Input() itemId: string = '';
  @Input() router: string = '';
  loadingDelete: boolean = false;

  constructor(
    private baseService: BaseService,
    private activeModal: NgbActiveModal,
    private translate: TranslateService
  ) { }

  removeItem(): void {
    this.setLoadingState(true);

    this.baseService.deleteItem(this.router, this.itemId).subscribe(
      () => {
        this.baseService.success(this.translate.instant('MODAL.DELETE_CONFIRMATION.SUCCESS_MESSAGE'));
        this.closeModal(true);
      },
      (error) => {
        console.error(this.translate.instant('MODAL.DELETE_CONFIRMATION.ERROR_MESSAGE'), error);
        this.setLoadingState(false);
      }
    );
  }

  closeModal(result: boolean): void {
    this.setLoadingState(false);
    this.activeModal.close({ success: result });
  }

  private setLoadingState(state: boolean): void {
    this.loadingDelete = state;
  }
}
