import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Info2Component } from './info2.component';

describe('Info2Component', () => {
  let component: Info2Component;
  let fixture: ComponentFixture<Info2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Info2Component]
    });
    fixture = TestBed.createComponent(Info2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
