import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ImgsGalleryComponent } from './base/components/imgs-gallery/imgs-gallery.component';
import { GalleryComponent } from './core/gallery/gallery.component';
import { HomeComponent } from './core/home/home.component';
import { PreeskitComponent } from './core/preeskit/preeskit.component';
import { StartComponent } from './core/start/start.component';

@NgModule({
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
  declarations: [AppComponent, HomeComponent, StartComponent, PreeskitComponent, GalleryComponent, ImgsGalleryComponent],
})
export class AppModule {}
