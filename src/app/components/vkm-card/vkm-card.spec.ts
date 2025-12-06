import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VkmCard } from './vkm-card';

describe('VkmCard', () => {
  let component: VkmCard;
  let fixture: ComponentFixture<VkmCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VkmCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VkmCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
