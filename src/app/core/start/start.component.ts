import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
  standalone: true
})
export class StartComponent {
  @Output() estadoMudou = new EventEmitter<string>();

  alterarEstado(novoEstado: string): void {
    this.estadoMudou.emit(novoEstado);
  }
}
