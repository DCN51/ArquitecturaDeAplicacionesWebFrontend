import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Userslistcomponent } from './userslistcomponent';

describe('Userslistcomponent', () => {
  let component: Userslistcomponent;
  let fixture: ComponentFixture<Userslistcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Userslistcomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Userslistcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
