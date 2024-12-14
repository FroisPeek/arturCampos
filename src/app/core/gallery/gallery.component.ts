import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { ImgsGalleryComponent } from 'src/app/base/components/imgs-gallery/imgs-gallery.component';
import { GalleryServices } from 'src/app/base/services/gallery.service';
import { ImgsType } from './gallery.interface';

@Component({
  selector: 'app-gallery',
  imports: [CommonModule, ImgsGalleryComponent],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  standalone: true
})
export class GalleryComponent {
  @Output() estadoMudou = new EventEmitter<string>();

  alterarEstado(novoEstado: string): void {
    this.estadoMudou.emit(novoEstado);
  }

  housingLocationList: ImgsType[] = [];
  housingService: GalleryServices = inject(GalleryServices);

  constructor(){
    this.housingLocationList = this.housingService.getAllImg();
  }
}
