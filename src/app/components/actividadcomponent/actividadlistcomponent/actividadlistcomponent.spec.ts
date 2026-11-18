import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Actividadlistcomponent } from './actividadlistcomponent';

describe('Actividadlistcomponent', () => {
  let component: Actividadlistcomponent;
  let fixture: ComponentFixture<Actividadlistcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Actividadlistcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Actividadlistcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
