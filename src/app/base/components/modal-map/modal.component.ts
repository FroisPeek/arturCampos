import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true
})
export class ModalComponent {
  @ViewChild('modal') private modal?: ElementRef<HTMLDialogElement>

  private get modalElement() {
    return this.modal?.nativeElement as HTMLDialogElement;
  }

  showModal() {
    this.modalElement.showModal();
  }

  closeModal() {
    this.modalElement.close();
  }
}
