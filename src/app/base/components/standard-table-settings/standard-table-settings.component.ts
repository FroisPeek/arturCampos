import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StandardTableSettingsService } from './standard-table-settings.service';
import { TableColumn } from './standard-table-settings.interface';

@Component({
    selector: 'standard-table-settings',
    templateUrl: './standard-table-settings.component.html',
    styleUrls: ['./standard-table-settings.component.scss']
})
export class StandardTableSettingsComponent implements OnInit {
    @Input() columns: any[];
    @Output() settingsChanged = new EventEmitter<any[]>();

    fixColumn: boolean = false;

    constructor(
        public standardTableSettingsService: StandardTableSettingsService
    ) { }

    ngOnInit(): void {
        let columns = this.standardTableSettingsService.getColumns();
        if (columns.length > 0) {
            this.columns = this.standardTableSettingsService.getColumns();
        }

        this.columns = this.columns.map(col => ({
            ...col,
            visible: col.visible !== false
        }));
    }

    moveColumn(column: TableColumn, direction: 'up' | 'down'): void {
        const index = this.columns.indexOf(column);
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        if (newIndex >= 0 && newIndex < this.columns.length) {
            [this.columns[index], this.columns[newIndex]] = [this.columns[newIndex], this.columns[index]];
            this.standardTableSettingsService.setColumns(this.columns);
            this.settingsChanged.emit(this.columns);
        }
    }

    toggleColumnVisibility(column: TableColumn, index: number): void {
        if (this.columns[index].visible) {
            this.columns[index].visible = false;
        } else {
            this.columns[index].visible = true;
        }
        this.standardTableSettingsService.setColumns(this.columns);
        this.settingsChanged.emit(this.columns);
    }

    toggleFixColumn(column: TableColumn): void {
        column.fixed = !column.fixed;

        if (column.fixed) {
            column.visible = true;
        }

        const fixed = this.columns.filter((item) => item.fixed == true);
        this.fixColumn = fixed.length > 0 ? true : false;
        this.standardTableSettingsService.setColumns(this.columns);
        this.settingsChanged.emit(this.columns);
    }

    deleteColumn(column: TableColumn): void {
        this.columns = this.columns.filter(col => col.key !== column.key);
        this.standardTableSettingsService.setColumns(this.columns);
        this.settingsChanged.emit(this.columns);
    }

    closeSettings(): void {
        this.standardTableSettingsService.hideSettings();
    }
}
