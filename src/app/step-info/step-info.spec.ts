import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepInfo } from './step-info';

describe('StepInfo', () => {
  let component: StepInfo;
  let fixture: ComponentFixture<StepInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
