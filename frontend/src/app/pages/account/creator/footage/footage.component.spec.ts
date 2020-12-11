import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootageComponent } from './footage.component';

describe('FootageComponent', () => {
  let component: FootageComponent;
  let fixture: ComponentFixture<FootageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FootageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FootageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
