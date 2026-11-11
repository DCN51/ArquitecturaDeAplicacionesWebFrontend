import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rolecomponent } from './rolecomponent';

describe('Rolecomponent', () => {
  let component: Rolecomponent;
  let fixture: ComponentFixture<Rolecomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rolecomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Rolecomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
