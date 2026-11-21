import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Suscripcionporvencercomponent } from './suscripcionporvencercomponent';

describe('Suscripcionporvencercomponent', () => {
  let component: Suscripcionporvencercomponent;
  let fixture: ComponentFixture<Suscripcionporvencercomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Suscripcionporvencercomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Suscripcionporvencercomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
