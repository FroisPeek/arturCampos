import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './core/home/home.component';
import { Info1Component } from './info1/info1.component';
import { Info2Component } from './info2/info2.component';
import { Info3Component } from './info3/info3.component';

@NgModule({
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
  declarations: [AppComponent, HomeComponent, Info1Component, Info2Component, Info3Component],
})
export class AppModule {}
