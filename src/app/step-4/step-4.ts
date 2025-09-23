import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-step-4',
  imports: [],
  template: `
    <p>
      step-4 works!
    </p>
  `,
  styles: ``
})
export class Step4 {
  @Output() nextStep = new EventEmitter<void>();

  constructor() {}
}
