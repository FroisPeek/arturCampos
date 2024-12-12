import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BaseService } from "../../base.service";
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'core-drop-file-input',
    templateUrl: './drop-file-input.component.html',
    styleUrls: ['./drop-file-input.component.scss']
})
export class DropFileInputComponent implements OnInit {
    @Output() fileChanged = new EventEmitter<File | FileList>();
    @Input() acceptedTypes: string[] = [];
    @Input() multiple = false;
    @Input() inputId = "file-input";

    file?: File;
    hover = false;
    files?: FileList;
    acceptString = '';

    constructor(
        private toastrService: BaseService,
        private translateService: TranslateService
    ) {}

    ngOnInit(): void {
        this.acceptString = this.generateAcceptString();
    }

    onFileChange(event: Event): void {
        const inputElement = event.target as HTMLInputElement;

        if (!inputElement.files?.length) {
            this.fileChanged.emit(undefined);
            return;
        }

        this.emitFiles(inputElement.files);
    }

    onFileDrop(event: DragEvent): void {
        event.preventDefault();
        const droppedFiles = event.dataTransfer?.files;

        if (!droppedFiles || droppedFiles.length === 0) {
            this.hover = false;
            return;
        }

        if (this.isFileTypeAccepted(droppedFiles[0])) {
            this.emitFiles(droppedFiles);
        } else {
            this.showInvalidFileTypeError();
        }

        this.hover = false;
    }

    onDragOver(event: Event): void {
        event.preventDefault();
        this.hover = true;
    }

    onDragEnd(event: Event): void {
        this.hover = false;
    }

    private isFileTypeAccepted(file: File): boolean {
        return this.acceptedTypes.includes(file.type);
    }

    private showInvalidFileTypeError(): void {
        const errorMessage = this.translateService.instant('DROP_FILE.ERROR.INVALID_TYPE');
        this.toastrService.error(errorMessage);
    }

    private emitFiles(fileList: FileList): void {
        if (this.multiple) {
            this.files = fileList;
            this.fileChanged.emit(this.files);
        } else {
            this.file = fileList[0];
            this.fileChanged.emit(this.file);
        }
    }

    private generateAcceptString(): string {
        return this.acceptedTypes.join(',');
    }
}
