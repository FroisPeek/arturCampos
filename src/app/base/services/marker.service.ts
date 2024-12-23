import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  private locale: [number, number] = [-15.793897984838962, -47.88277758036451];

  constructor() { }

  makeCapitalMarkers(map: L.Map): void {
    const marker = L.marker(this.locale);
    marker.addTo(map);
    marker.bindPopup('Local do evento').openPopup();
  }
}
