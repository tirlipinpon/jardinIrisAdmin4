import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostGenerateByIaComponent } from './post-generate-by-ia.component';

describe('PostGenerateByIaComponent', () => {
  let component: PostGenerateByIaComponent;
  let fixture: ComponentFixture<PostGenerateByIaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostGenerateByIaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostGenerateByIaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
