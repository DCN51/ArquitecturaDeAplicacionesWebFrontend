import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Usersupdatecomponent } from './usersupdatecomponent';

describe('Usersupdatecomponent', () => {
  let component: Usersupdatecomponent;
  let fixture: ComponentFixture<Usersupdatecomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Usersupdatecomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Usersupdatecomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
