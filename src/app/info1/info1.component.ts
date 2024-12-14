import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-info1',
  templateUrl: './info1.component.html',
  styleUrls: ['./info1.component.scss'],
  standalone: true
})
export class Info1Component {
  @Output() estadoMudou = new EventEmitter<string>();

  alterarEstado(novoEstado: string): void {
    this.estadoMudou.emit(novoEstado);
  }
}
