import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDriverComponent } from './create-driver';

describe('CreateDriver', () => {
  let component: CreateDriverComponent;
  let fixture: ComponentFixture<CreateDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDriverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDriverComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
