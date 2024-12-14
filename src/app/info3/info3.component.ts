import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-info3',
  templateUrl: './info3.component.html',
  styleUrls: ['./info3.component.scss'],
  standalone: true
})
export class Info3Component {
  @Output() estadoMudou = new EventEmitter<string>();

  alterarEstado(novoEstado: string): void {
    this.estadoMudou.emit(novoEstado);
  }
}
