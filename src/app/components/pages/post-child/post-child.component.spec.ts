import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostChildComponent } from './post-child.component';

describe('PostChildComponent', () => {
  let component: PostChildComponent;
  let fixture: ComponentFixture<PostChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostChildComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
