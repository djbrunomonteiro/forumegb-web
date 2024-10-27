import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoNewUserComponent } from './info-new-user.component';

describe('InfoNewUserComponent', () => {
  let component: InfoNewUserComponent;
  let fixture: ComponentFixture<InfoNewUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoNewUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoNewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
