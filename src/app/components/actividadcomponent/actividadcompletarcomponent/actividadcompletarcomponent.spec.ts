import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Actividadcompletarcomponent } from './actividadcompletarcomponent';

describe('Actividadcompletarcomponent', () => {
  let component: Actividadcompletarcomponent;
  let fixture: ComponentFixture<Actividadcompletarcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Actividadcompletarcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Actividadcompletarcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
