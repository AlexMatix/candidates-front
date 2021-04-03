import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateIneComponent } from './candidate-ine.component';

describe('CandidateIneComponent', () => {
  let component: CandidateIneComponent;
  let fixture: ComponentFixture<CandidateIneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateIneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateIneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
