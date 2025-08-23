import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookConfirmed } from './book-confirmed';

describe('BookConfirmed', () => {
  let component: BookConfirmed;
  let fixture: ComponentFixture<BookConfirmed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookConfirmed]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookConfirmed);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
