import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';


@Component({
  selector: 'app-progress-tracker',
  imports: [NgClass],
  template: `
    <section class="flex gap-4"> 
      <article class="w-4 h-4 rounded-full border-white border-2"
                [ngClass]="{ 'bg-white': progress === 0 }"></article>
      <article class="w-4 h-4 rounded-full border-white border-2"
                [ngClass]="{ 'bg-white': progress === 1 }"></article>
      <article class="w-4 h-4 rounded-full border-white border-2"
                [ngClass]="{ 'bg-white': progress === 2 }"></article>
      <article class="w-4 h-4 rounded-full border-white border-2"
                [ngClass]="{ 'bg-white': progress === 3 }"></article>
    </section>
  `,
  styles: ``
})
export class ProgressTracker {
  @Input() progress: number = 0;
}
