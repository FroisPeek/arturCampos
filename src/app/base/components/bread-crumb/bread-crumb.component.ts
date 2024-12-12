import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

export interface BreadCrumbInterface {
  name: string;
  path: string;
}

@Component({
  selector: 'core-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.scss']
})
export class BreadCrumbComponent implements OnInit {
  @Input() breadCrumbData: BreadCrumbInterface[] = [];

  constructor(private router: Router, private translate: TranslateService) {}

  ngOnInit(): void {}

  navigateTo(item: BreadCrumbInterface): void {
    const isNotLastItem = this.breadCrumbData[this.breadCrumbData.length - 1].path !== item.path;
    if (isNotLastItem) {
      this.router.navigate([item.path]);
    }
  }

  getTranslatedName(item: BreadCrumbInterface): string {
    return this.translate.instant(item.name);
  }
}
