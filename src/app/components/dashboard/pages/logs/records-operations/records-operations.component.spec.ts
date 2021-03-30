import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordsOperationsComponent } from './records-operations.component';

describe('RecordsOperationsComponent', () => {
  let component: RecordsOperationsComponent;
  let fixture: ComponentFixture<RecordsOperationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordsOperationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
