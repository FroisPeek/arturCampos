import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-modal-map',
  templateUrl: './modal-map.component.html',
  styleUrls: ['./modal-map.component.scss'],
  standalone: true
})
export class ModalMapComponent implements AfterViewInit {
  @ViewChild('modalMap') private modalMap?: ElementRef<HTMLDialogElement>;
  private map!: L.Map;

  private initMap(): void {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      console.error('Elemento do mapa não encontrado!');
      return;
    }

    this.map = L.map(mapContainer, {
      center: [-15.793897984838962, -47.88277758036451],
      zoom: 13
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  private get modalElement(): HTMLDialogElement | undefined {
    return this.modalMap?.nativeElement;
  }

  showModalMap() {
    if (this.modalElement) {
      this.modalElement.showModal();
      setTimeout(() => {
        if (!this.map) {
          this.initMap();
        } else {
          this.map.invalidateSize();
        }
      }, 0);
    } else {
      console.error('Modal não encontrado!');
    }
  }

  closeModalMap() {
    if (this.modalElement) {
      this.modalElement.close();
    }
  }

  ngAfterViewInit(): void {
    console.log('ModalMapComponent: DOM inicializado.');
  }
}
