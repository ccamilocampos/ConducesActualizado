import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVehicleComponent} from './create-vehicle';

describe('CreateVehicle', () => {
  let component: CreateVehicleComponent;
  let fixture: ComponentFixture<CreateVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateVehicleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateVehicleComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
