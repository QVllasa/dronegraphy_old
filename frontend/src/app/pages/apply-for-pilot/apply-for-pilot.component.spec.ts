import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyForPilotComponent } from './apply-for-pilot.component';

describe('ApplyForPilotComponent', () => {
  let component: ApplyForPilotComponent;
  let fixture: ComponentFixture<ApplyForPilotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyForPilotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyForPilotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
