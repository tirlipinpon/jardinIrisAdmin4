import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostGeneralComponent } from './post-general.component';

describe('PostGeneralComponent', () => {
  let component: PostGeneralComponent;
  let fixture: ComponentFixture<PostGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
