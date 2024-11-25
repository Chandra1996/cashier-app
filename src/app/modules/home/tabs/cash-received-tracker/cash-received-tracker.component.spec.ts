import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashReceivedTrackerComponent } from './cash-received-tracker.component';

describe('CashReceivedTrackerComponent', () => {
  let component: CashReceivedTrackerComponent;
  let fixture: ComponentFixture<CashReceivedTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashReceivedTrackerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashReceivedTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
