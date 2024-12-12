import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Header } from './standard-table-tools.component';

@Injectable({
  providedIn: 'root'
})
export class StandardTableToolsService {
  private headersSource = new BehaviorSubject<Header[]>([]);
  headers$ = this.headersSource.asObservable();

  setHeaders(headers: Header[]): void {
    this.headersSource.next(headers);
  }

  getHeader(): Header[] {
    return this.headersSource.getValue();
  }

  clearHeaders(): void {
    this.headersSource.next([]);
  }
}