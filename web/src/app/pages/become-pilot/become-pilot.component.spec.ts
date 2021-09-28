import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomePilotComponent } from './become-pilot.component';

describe('BecomePilotComponent', () => {
  let component: BecomePilotComponent;
  let fixture: ComponentFixture<BecomePilotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BecomePilotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomePilotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
