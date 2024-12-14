import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-info2',
  templateUrl: './info2.component.html',
  styleUrls: ['./info2.component.scss'],
  standalone: true
})
export class Info2Component {
  @Output() estadoMudou = new EventEmitter<string>();

  alterarEstado(novoEstado: string): void {
    this.estadoMudou.emit(novoEstado);
  }
}
