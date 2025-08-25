import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationConfig } from './reservation-config';

describe('ReservationConfig', () => {
  let component: ReservationConfig;
  let fixture: ComponentFixture<ReservationConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationConfig]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
