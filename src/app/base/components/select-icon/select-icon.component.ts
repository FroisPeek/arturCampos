import { Component, OnInit } from "@angular/core";
import { ListIconInterface, SelectIconInterface } from "../../base.interface";
import listIcons from './select-icon.json';
import { NgbActiveModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

interface DisplayIcon extends ListIconInterface {
    selector: string;
}

@Component({
    selector: 'app-select-icon',
    templateUrl: 'select-icon.component.html',
    styleUrls: ['select-icon.component.scss']
})
export class SelectIconComponent implements OnInit {
    types: Array<'all' | 'regular' | 'solid' | 'logos'> = ['all', 'regular', 'solid', 'logos'];
    iconType: 'all' | 'logos' | 'solid' | 'regular' = 'all';
    availableIcons: SelectIconInterface[] = listIcons;
    filteredIcons: DisplayIcon[] = [];
    selectedIcon: DisplayIcon | null = null;
    searchTerm: string = '';

    modalRef: NgbModalRef;

    constructor(
        public activeModal: NgbActiveModal
    ) { }

    ngOnInit(): void {
        this.selectIconType(this.iconType);
    }

    setModalRef(ref: NgbModalRef) {
        this.modalRef = ref;
    }
    processIcons(): void {
        let icons: DisplayIcon[] = [];
        if (this.iconType === 'all') {
            this.availableIcons.forEach(iconSet => {
                icons = icons.concat(iconSet.list.map(icon => ({
                    ...icon,
                    selector: iconSet.selector
                })));
            });
        } else {
            const selectedIconType = this.availableIcons.find(iconSet => iconSet.type === this.iconType);
            if (selectedIconType) {
                icons = selectedIconType.list.map(icon => ({
                    ...icon,
                    selector: selectedIconType.selector
                }));
            }
        }

        if (this.searchTerm) {
            this.filteredIcons = icons.filter(icon => icon.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
        } else {
            this.filteredIcons = icons;
        }
    }

    selectIconType(type: 'all' | 'logos' | 'solid' | 'regular'): void {
        this.iconType = type;
        this.processIcons();
    }

    onSearchTermChange(): void {
        this.processIcons();
    }

    confirmUsageIcon() {
        if (this.selectedIcon) {
            const icon = this.selectedIcon.selector + this.selectedIcon.icon;
            this.modalRef.close({
                successIcon: true,
                selectedIcon: icon
            });
        }
    }

    selectIcon(icon: DisplayIcon): void {
        this.selectedIcon = icon;
    }

    closeModal(successIcon: boolean): void {
        this.activeModal.close({ successIcon });
    }
}
