import { Component, Input } from '@angular/core';
import { ImgsType } from 'src/app/core/gallery/gallery.interface';

@Component({
  selector: 'app-imgs-gallery',
  templateUrl: './imgs-gallery.component.html',
  styleUrls: ['./imgs-gallery.component.scss'],
  standalone: true
})
export class ImgsGalleryComponent {
  @Input() imgsGallery!: ImgsType;
}
