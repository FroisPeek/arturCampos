import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StandardFilterComponent } from './standard-filter.component';

describe('StandardFilterComponent', () => {
  let component: StandardFilterComponent;
  let fixture: ComponentFixture<StandardFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandardFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
