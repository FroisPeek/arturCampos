import { BehaviorSubject, Observable } from 'rxjs';
import { TableColumn } from './standard-table-settings.interface';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StandardTableSettingsService {
    private display = new BehaviorSubject<boolean>(false);
    private columnsSubject = new BehaviorSubject<TableColumn[]>([]);

    display$ = this.display.asObservable();
    columns$: Observable<TableColumn[]> = this.columnsSubject.asObservable();

    showSettings(): void {
        this.display.next(true);
    }

    hideSettings(): void {
        this.display.next(false);
    }

    setColumns(columns: TableColumn[]): void {
        this.columnsSubject.next(columns);
    }

    getColumns(): TableColumn[] {
        return this.columnsSubject.getValue();
    }

    clearColumns(): void {
        this.columnsSubject.next([]);
    }
}