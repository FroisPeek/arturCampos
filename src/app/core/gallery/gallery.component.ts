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
  @Output() watchState = new EventEmitter<string>();

  changeState(newState: string): void {
    this.watchState.emit(newState);
  }

  imgsGalleryList: ImgsType[] = [];
  galleryService: GalleryServices = inject(GalleryServices);

  constructor() {
    this.imgsGalleryList = this.galleryService.getAllImg();
  }
}
