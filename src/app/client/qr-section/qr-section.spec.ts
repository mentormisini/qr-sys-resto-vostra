import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrSection } from './qr-section';

describe('QrSection', () => {
  let component: QrSection;
  let fixture: ComponentFixture<QrSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
