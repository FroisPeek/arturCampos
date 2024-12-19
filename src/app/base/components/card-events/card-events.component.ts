import { Component, Input } from '@angular/core';
import { Card } from 'src/app/core/start/start.interface';
import { ModalComponent } from '../modal-map/modal.component';
@Component({
  selector: 'app-card-events',
  templateUrl: './card-events.component.html',
  styleUrls: ['./card-events.component.scss'],
  imports: [ModalComponent],
  standalone: true,
})
export class CardEventsComponent {
  @Input() event!: Card;
}
