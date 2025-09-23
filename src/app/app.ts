import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { Main } from './main/main';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Navbar, Main],
  template: `
    <div class="flex">
      <app-navbar class="flex-3" [progress]="progress()"></app-navbar>
      <app-main class="flex-5" (nextStep)="incrementProgress()" [progress]="progress()"></app-main>
    </div>
    <router-outlet></router-outlet>
  `,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('fundwise');
  progress = signal(0);

  incrementProgress = () => {
    this.progress.update(p => p + 1);
    console.log("Siguiente paso");
    
  }
}
