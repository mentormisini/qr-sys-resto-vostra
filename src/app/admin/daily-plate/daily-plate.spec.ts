import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPlate } from './daily-plate';

describe('DailyPlate', () => {
  let component: DailyPlate;
  let fixture: ComponentFixture<DailyPlate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyPlate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyPlate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
