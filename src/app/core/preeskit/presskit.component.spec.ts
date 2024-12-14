import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreeskitComponent } from './preeskit.component';

describe('PreeskitComponent', () => {
  let component: PreeskitComponent;
  let fixture: ComponentFixture<PreeskitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreeskitComponent]
    });
    fixture = TestBed.createComponent(PreeskitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
