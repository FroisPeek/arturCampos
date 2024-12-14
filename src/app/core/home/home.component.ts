import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Info1Component } from 'src/app/info1/info1.component';
import { Info2Component } from 'src/app/info2/info2.component';
import { Info3Component } from 'src/app/info3/info3.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Info1Component, Info2Component, Info3Component],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  estadoAtual: string = 'info1';

  alterarEstado(novoEstado: string): void {
    this.estadoAtual = novoEstado;
  }
}
