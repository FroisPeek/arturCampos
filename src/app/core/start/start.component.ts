import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CardEventsComponent } from 'src/app/base/components/card-events/card-events.component';
import { StartSercices } from 'src/app/base/services/start.service';
import { Card } from './start.interface';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
  standalone: true,
  imports: [CardEventsComponent, CommonModule],
})
export class StartComponent {
  @Output() estadoMudou = new EventEmitter<string>();

  alterarEstado(novoEstado: string): void {
    this.estadoMudou.emit(novoEstado);
  }

  eventsList: Card[] = [];
  funkList: Card[] = [];
  haveList: Card[] = [];

  startServices: StartSercices = inject(StartSercices);

  constructor() {
    this.eventsList = this.startServices.getAllEvents();
    this.funkList = this.startServices.getAllFunkEvents();
    this.haveList = this.startServices.getAllHaveEvents();
  }
}
