import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GalleryComponent } from 'src/app/core/gallery/gallery.component';
import { PreeskitComponent } from '../preeskit/preeskit.component';
import { StartComponent } from '../start/start.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, StartComponent, PreeskitComponent, GalleryComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  estadoAtual: string = 'start';

  alterarEstado(novoEstado: string): void {
    this.estadoAtual = novoEstado;
  }
}
