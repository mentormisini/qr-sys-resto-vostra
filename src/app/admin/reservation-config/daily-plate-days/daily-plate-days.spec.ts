import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPlateDays } from './daily-plate-days';

describe('DailyPlateDays', () => {
  let component: DailyPlateDays;
  let fixture: ComponentFixture<DailyPlateDays>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyPlateDays]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyPlateDays);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
