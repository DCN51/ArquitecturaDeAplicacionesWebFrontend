import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reportcomponent } from './reportcomponent';

describe('Reportcomponent', () => {
  let component: Reportcomponent;
  let fixture: ComponentFixture<Reportcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reportcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Reportcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
