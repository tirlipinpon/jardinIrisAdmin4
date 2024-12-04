import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestLinkComponent } from './test-link.component';

describe('TestLinkComponent', () => {
  let component: TestLinkComponent;
  let fixture: ComponentFixture<TestLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
