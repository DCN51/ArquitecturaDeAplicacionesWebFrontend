import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Userscomponent } from './userscomponent';

describe('Userscomponent', () => {
  let component: Userscomponent;
  let fixture: ComponentFixture<Userscomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Userscomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Userscomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
