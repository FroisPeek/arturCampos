import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-preeskit',
  templateUrl: './preeskit.component.html',
  styleUrls: ['./presskit.component.scss'],
  standalone: true
})
export class PreeskitComponent {
  @Output() estadoMudou = new EventEmitter<string>();

  alterarEstado(novoEstado: string): void {
    this.estadoMudou.emit(novoEstado);
  }
}
