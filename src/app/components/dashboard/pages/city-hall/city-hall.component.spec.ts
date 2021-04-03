import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityHallComponent } from './city-hall.component';

describe('CityHallComponent', () => {
  let component: CityHallComponent;
  let fixture: ComponentFixture<CityHallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CityHallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CityHallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
