import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Info1Component } from './start.component';

describe('Info1Component', () => {
  let component: Info1Component;
  let fixture: ComponentFixture<Info1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Info1Component]
    });
    fixture = TestBed.createComponent(Info1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
