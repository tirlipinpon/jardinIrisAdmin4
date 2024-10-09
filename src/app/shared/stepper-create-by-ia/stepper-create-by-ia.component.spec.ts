import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperCreateByIaComponent } from './stepper-create-by-ia.component';

describe('StepperCreateByIaComponent', () => {
  let component: StepperCreateByIaComponent;
  let fixture: ComponentFixture<StepperCreateByIaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperCreateByIaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepperCreateByIaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
