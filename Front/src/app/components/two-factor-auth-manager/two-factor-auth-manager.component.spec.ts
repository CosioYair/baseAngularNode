import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoFactorAuthManagerComponent } from './two-factor-auth-manager.component';

describe('TwoFactorAuthManagerComponent', () => {
  let component: TwoFactorAuthManagerComponent;
  let fixture: ComponentFixture<TwoFactorAuthManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwoFactorAuthManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoFactorAuthManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
