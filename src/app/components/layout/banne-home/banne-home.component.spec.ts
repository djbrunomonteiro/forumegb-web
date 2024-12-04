import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanneHomeComponent } from './banne-home.component';

describe('BanneHomeComponent', () => {
  let component: BanneHomeComponent;
  let fixture: ComponentFixture<BanneHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BanneHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BanneHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
