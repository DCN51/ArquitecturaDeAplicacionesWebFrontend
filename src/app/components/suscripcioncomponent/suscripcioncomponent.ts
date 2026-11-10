import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menucomponent } from '../menucomponent/menucomponent';

@Component({
  selector: 'app-suscripcioncomponent',
  imports: [Menucomponent, RouterOutlet],
  templateUrl: './suscripcioncomponent.html',
  styleUrl: './suscripcioncomponent.css',
})
export class Suscripcioncomponent {}