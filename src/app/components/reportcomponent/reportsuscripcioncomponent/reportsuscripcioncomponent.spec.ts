import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reportsuscripcioncomponent } from './reportsuscripcioncomponent';

describe('Reportsuscripcioncomponent', () => {
  let component: Reportsuscripcioncomponent;
  let fixture: ComponentFixture<Reportsuscripcioncomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reportsuscripcioncomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Reportsuscripcioncomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
