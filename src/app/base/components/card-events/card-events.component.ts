import { Component, Input } from '@angular/core';
import { Card } from 'src/app/core/start/start.interface';
import { ModalComponent } from '../modal-form/modal.component';
import { ModalMapComponent } from '../modal-map/modal-map.component';
@Component({
  selector: 'app-card-events',
  templateUrl: './card-events.component.html',
  styleUrls: ['./card-events.component.scss'],
  imports: [ModalComponent, ModalMapComponent],
  standalone: true,
})
export class CardEventsComponent {
  @Input() event!: Card;
}
