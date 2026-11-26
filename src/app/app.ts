import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Burbujamindcitocomponent } from './components/burbujamindcitocomponent/burbujamindcitocomponent';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Burbujamindcitocomponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mindhealthFront');
}
