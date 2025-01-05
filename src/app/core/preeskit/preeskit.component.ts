import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-preeskit',
  templateUrl: './preeskit.component.html',
  styleUrls: ['./presskit.component.scss'],
  standalone: true
})
export class PreeskitComponent {
  @Output() watchState = new EventEmitter<string>();

  changeState(newState: string): void {
    this.watchState.emit(newState);
  }
}
