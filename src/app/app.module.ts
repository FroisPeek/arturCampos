import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardEventsComponent } from './base/components/card-events/card-events.component';
import { ImgsGalleryComponent } from './base/components/imgs-gallery/imgs-gallery.component';
import { ModalComponent } from './base/components/modal-form/modal.component';
import { ModalMapComponent } from './base/components/modal-map/modal-map.component';
import { MarkerService } from './base/services/marker.service';
import { GalleryComponent } from './core/gallery/gallery.component';
import { HomeComponent } from './core/home/home.component';
import { PreeskitComponent } from './core/preeskit/preeskit.component';
import { StartComponent } from './core/start/start.component';
@NgModule({
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [MarkerService],
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    HomeComponent,
    StartComponent,
    PreeskitComponent,
    GalleryComponent,
    ImgsGalleryComponent,
    CardEventsComponent,
    ModalComponent,
    ModalMapComponent,
  ],
})
export class AppModule { }
