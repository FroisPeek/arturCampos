import { Injectable } from '@angular/core';
import { Card } from 'src/app/core/start/start.interface';

@Injectable({
  providedIn: 'root',
})
export class StartSercices {
  myEvents: Card[] = [
    {
      img: '../../../assets/sextagode.svg',
      title: 'SEXTAGODE',
      date: '16 de dezembro de 2024',
      hour: '18h às 02h',
      location: 'Arena BRB, Brasília - DF',
      price: 'R$150,00',
      tag: 'tag',
    },
    {
      img: '../../../assets/napraia.svg',
      title: 'Na Praia',
      date: '16 de dezembro de 2024',
      hour: '18h às 02h',
      location: 'Arena BRB, Brasília - DF',
      price: 'R$150,00',
      tag: 'tag',
    },
    {
      img: '../../../assets/foraEixo.svg',
      title: 'Complexo Fora do Eixo',
      date: '16 de dezembro de 2024',
      hour: '18h às 02h',
      location: 'Arena BRB, Brasília - DF',
      price: 'R$150,00',
      tag: 'tag',
    },
    {
      img: '../../../assets/funnFestival.svg',
      title: 'Funn Festival',
      date: '16 de dezembro de 2024',
      hour: '18h às 02h',
      location: 'Arena BRB, Brasília - DF',
      price: 'R$150,00',
      tag: 'tag',
    },
  ];

  funkEvent: Card[] = [
    {
      img: '../../../assets/funkTitans.svg',
      title: 'Funk dos Titans',
      date: '16 de dezembro de 2024',
      hour: '18h às 02h',
      location: 'Arena BRB, Brasília - DF',
      price: 'R$150,00',
      tag: 'tag',
    },
  ];

  haveEvent: Card[] = [
    {
      img: '../../../assets/boma.svg',
      title: 'BOMA',
      date: '16 de dezembro de 2024',
      hour: '18h às 02h',
      location: 'Arena BRB, Brasília - DF',
      price: 'R$150,00',
      tag: 'tag',
    },
    {
      img: '../../../assets/virada.svg',
      title: 'Virada Eletrônica',
      date: '16 de dezembro de 2024',
      hour: '18h às 02h',
      location: 'Arena BRB, Brasília - DF',
      price: 'R$150,00',
      tag: 'tag',
    },
  ];

  getAllEvents(): Card[] {
    return this.myEvents;
  }

  getAllFunkEvents(): Card[] {
    return this.funkEvent;
  }

  getAllHaveEvents(): Card[] {
    return this.haveEvent;
  }

  getEventById(id: number): Card | undefined {
    return this.myEvents.find((event) => event.id === id);
  }

  constructor() {}
}
