import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { MarkerService } from '../../services/marker.service';

const iconRetinaUrl = '../../../../assets/marker-icon-2x.png';
const iconUrl = '../../../../assets/marker-icon.png';
const shadowUrl = '../../../../assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-modal-map',
  templateUrl: './modal-map.component.html',
  styleUrls: ['./modal-map.component.scss'],
  standalone: true,
})
export class ModalMapComponent implements AfterViewInit {
  @ViewChild('modalMap') private modalMap?: ElementRef<HTMLDialogElement>;
  private map!: L.Map;

  constructor(private markerService: MarkerService) { }

  private initMap(): void {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      console.error('Elemento do mapa não encontrado!');
      return;
    }

    this.map = L.map(mapContainer, {
      center: [-15.793897984838962, -47.88277758036451],
      zoom: 13,
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    tiles.addTo(this.map);

    this.markerService.makeCapitalMarkers(this.map);
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
