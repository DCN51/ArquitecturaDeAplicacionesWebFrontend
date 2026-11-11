import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Actividadinsertcomponent } from './actividadinsertcomponent';

describe('Actividadinsertcomponent', () => {
  let component: Actividadinsertcomponent;
  let fixture: ComponentFixture<Actividadinsertcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Actividadinsertcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Actividadinsertcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
