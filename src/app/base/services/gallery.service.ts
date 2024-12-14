import { Injectable } from '@angular/core';
import { ImgsType } from 'src/app/core/gallery/gallery.interface';

@Injectable({
  providedIn: 'root',
})
export class GalleryServices {
  readonly baseUrl = 'https://angular.io/assets/images/tutorials/faa';

  imgList: ImgsType[] = [
    {
      id: 0,
      photo: `../assets/Component 12.png`,
    },
    {
      id: 1,
      photo: `../assets/Rectangle 2811.jpg`,
    },
    {
      id: 2,
      photo: `../assets/Rectangle 2813.jpg`,
    },
    {
      id: 3,
      photo: `../assets/Rectangle 2812.jpg`,
    },
    {
      id: 4,
      photo: `../assets/Rectangle 2814.jpg`,
    },
    {
      id: 5,
      photo: `../assets/Rectangle 2815.jpg`,
    },
    {
      id: 6,
      photo: `../assets/Rectangle 2816.jpg`,
    },
  ];

  getAllImg(): ImgsType[] {
    return this.imgList;
  }

  getImgById(id: number): ImgsType | undefined {
    return this.imgList.find(
      (img) => img.id === id
    );
  }

  constructor() {}
}
