import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConducesSnack } from './conduces-snack';

describe('ConducesSnack', () => {
  let component: ConducesSnack;
  let fixture: ComponentFixture<ConducesSnack>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConducesSnack]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConducesSnack);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
