import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SightWordCardComponent } from './sight-word-card.component';

describe('SightWordCardComponent', () => {
  let component: SightWordCardComponent;
  let fixture: ComponentFixture<SightWordCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SightWordCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SightWordCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
