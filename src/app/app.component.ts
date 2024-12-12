import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './core/home/home.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule, HomeComponent],
  standalone: true,
})
export class AppComponent {
  title = 'homes';
}
