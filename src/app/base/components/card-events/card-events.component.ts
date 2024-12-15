import { Component, Input } from '@angular/core';
import { Card } from 'src/app/core/start/start.interface';

@Component({
  selector: 'app-card-events',
  templateUrl: './card-events.component.html',
  styleUrls: ['./card-events.component.scss'],
  standalone: true,
})
export class CardEventsComponent {
  @Input() event!: Card;
}
