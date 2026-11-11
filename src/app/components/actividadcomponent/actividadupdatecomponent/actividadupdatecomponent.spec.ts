import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Actividadupdatecomponent } from './actividadupdatecomponent';

describe('Actividadupdatecomponent', () => {
  let component: Actividadupdatecomponent;
  let fixture: ComponentFixture<Actividadupdatecomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Actividadupdatecomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Actividadupdatecomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
