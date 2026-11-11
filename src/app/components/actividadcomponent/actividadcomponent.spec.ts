import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Actividadcomponent } from './actividadcomponent';

describe('Actividadcomponent', () => {
  let component: Actividadcomponent;
  let fixture: ComponentFixture<Actividadcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Actividadcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Actividadcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
