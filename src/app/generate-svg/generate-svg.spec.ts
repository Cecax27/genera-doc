import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateSVG } from './generate-svg';

describe('GenerateSVG', () => {
  let component: GenerateSVG;
  let fixture: ComponentFixture<GenerateSVG>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateSVG]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateSVG);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
