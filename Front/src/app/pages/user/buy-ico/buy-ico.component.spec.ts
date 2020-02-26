import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyIcoComponent } from './buy-ico.component';

describe('BuyIcoComponent', () => {
  let component: BuyIcoComponent;
  let fixture: ComponentFixture<BuyIcoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyIcoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyIcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
