import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rolelistcomponent } from './rolelistcomponent';

describe('Rolelistcomponent', () => {
  let component: Rolelistcomponent;
  let fixture: ComponentFixture<Rolelistcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rolelistcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Rolelistcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
