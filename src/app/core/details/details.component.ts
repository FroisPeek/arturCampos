import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Info1Component } from 'src/app/info1/info1.component';
import { Info2Component } from 'src/app/info2/info2.component';
import { Info3Component } from 'src/app/info3/info3.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, Info1Component, Info2Component, Info3Component],
  template: `
    <section class="deucerto">
      <div>
        <h1>Seção de Informações</h1>
        <!-- Botões que controlam o estado -->
        <button (click)="alterarEstado('info1')">Mostrar Informação 1</button>
        <button (click)="alterarEstado('info2')">Mostrar Informação 2</button>
        <button (click)="alterarEstado('info3')">Mostrar Informação 3</button>
      </div>

      <!-- Exibição dos componentes controlada pelo estado -->
      <div class="info-section">
        <app-info1 *ngIf="estadoAtual === 'info1'"></app-info1>
        <app-info2 *ngIf="estadoAtual === 'info2'"></app-info2>
        <app-info3 *ngIf="estadoAtual === 'info3'"></app-info3>
      </div>
    </section>
  `,
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  estadoAtual: string = 'info1';

  alterarEstado(novoEstado: string): void {
    this.estadoAtual = novoEstado;
  }
}
