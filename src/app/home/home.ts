import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Navbar } from "../navbar/navbar";
import { Main } from '../main/main';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, Navbar, Navbar, Main, RouterLink],
  template: `
    <div class="flex">
      <a routerLink="/genera-svg">Genera SVG</a>
      <app-navbar class="flex-3" [progress]="progress()"></app-navbar>
      <app-main class="flex-5" (nextStep)="incrementProgress()" [progress]="progress()"></app-main>
    </div>
    <router-outlet></router-outlet>
  `,
  styleUrl: './home.css'
})
export class App {
  protected readonly title = signal('fundwise');
  progress = signal(0);

  incrementProgress = () => {
    this.progress.update(p => p + 1);
    console.log("Siguiente paso");
    
  }
}
