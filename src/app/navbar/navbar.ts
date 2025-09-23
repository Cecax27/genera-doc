import { Component, Input } from '@angular/core';
import { ProgressTracker } from '../progress-tracker/progress-tracker';
import { StepInfo } from '../step-info/step-info';

@Component({
  selector: 'app-navbar',
  imports: [ProgressTracker, StepInfo],
  template: `
    <div class="top-0 left-0 bottom-0 flex flex-col bg-blue-400 h-screen rounded-tr-4xl rounded-br-4xl px-16 justify-center">
    @if (isLoggedIn) {
       <app-progress-tracker [progress]="progress"></app-progress-tracker>
       <app-step-info [progress]="progress"></app-step-info>
    } @else {

    }
</div>
  `,
  styleUrl: './navbar.css'
})
export class Navbar {
  @Input() progress: number = 0;
  isLoggedIn = true;
}
