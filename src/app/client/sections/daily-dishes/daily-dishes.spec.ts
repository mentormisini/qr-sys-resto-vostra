import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyDishes } from './daily-dishes';

describe('DailyDishes', () => {
  let component: DailyDishes;
  let fixture: ComponentFixture<DailyDishes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyDishes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyDishes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
