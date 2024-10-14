import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostByPerplexityComponent } from './post-by-perplexity.component';

describe('PostByPerplexityComponent', () => {
  let component: PostByPerplexityComponent;
  let fixture: ComponentFixture<PostByPerplexityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostByPerplexityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostByPerplexityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
