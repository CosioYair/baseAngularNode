import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceConfirmationComponent } from './device-confirmation.component';

describe('DeviceConfirmationComponent', () => {
  let component: DeviceConfirmationComponent;
  let fixture: ComponentFixture<DeviceConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
